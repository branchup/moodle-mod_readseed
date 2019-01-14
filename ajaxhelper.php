<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Ajax helper for Read Seed
 *
 *
 * @package    mod_readseed
 * @copyright  Justin Hunt (justin@poodll.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('AJAX_SCRIPT', true);
require_once(dirname(dirname(dirname(__FILE__))).'/config.php');

use \mod_readseed\constants;
use \mod_readseed\utils;
use \mod_readseed\flower;
use \mod_readseed\aigrade;

$cmid = required_param('cmid',  PARAM_INT); // course_module ID, or
//$sessionid = required_param('sessionid',  PARAM_INT); // course_module ID, or
$filename= optional_param('filename','',  PARAM_TEXT); // data baby yeah
$rectime= optional_param('rectime', 0, PARAM_INT);
$action= optional_param('action', 'readingresults', PARAM_TEXT);
$attemptid= optional_param('attemptid', 0, PARAM_INT);
$quizresults= optional_param('quizresults', '', PARAM_RAW);
$flowerid = optional_param('flowerid', null, PARAM_INT);

$ret =new stdClass();

if ($cmid) {
    $cm         = get_coursemodule_from_id('readseed', $cmid, 0, false, MUST_EXIST);
    $course     = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
    $readseed  = $DB->get_record('readseed', array('id' => $cm->instance), '*', MUST_EXIST);
} else {
    $ret->success=false;
    $ret->message="You must specify a course_module ID or an instance ID";
    return json_encode($ret);
}

require_login($course, false, $cm);
$modulecontext = context_module::instance($cm->id);
$PAGE->set_context($modulecontext);

switch($action){
    case 'readingresults':
        process_reading_results($modulecontext,$filename,$rectime,$readseed);
        break;
    case 'quizresults':
        process_quizresults($modulecontext,$readseed, $quizresults, $attemptid, $flowerid);
}
return;

//save the data to Moodle.
function process_quizresults($modulecontext,$readseed,$quizresults,$attemptid, $flowerid)
{
    global $USER, $DB;

    $result=false;
    $message = '';
    $returndata=false;

    $attempt = $DB->get_record(constants::M_USERTABLE,array('id'=>$attemptid,'userid'=>$USER->id));
    if($attempt) {
        $useresults = json_decode($quizresults);
        $answers = $useresults->answers;
        //more data here

        if (isset($answers->{'1'})) { $attempt->qanswer1 = $answers->{'1'}; }
        if (isset($answers->{'2'})) { $attempt->qanswer2 = $answers->{'2'}; }
        if (isset($answers->{'3'})) { $attempt->qanswer3 = $answers->{'3'}; }
        if (isset($answers->{'4'})) { $attempt->qanswer4 = $answers->{'4'}; }
        if (isset($answers->{'5'})) { $attempt->qanswer5 = $answers->{'5'}; }

        // if (isset($useresults->qtextanswer1)){$attempt->qtextanswer1=$useresults->qtextanswer1;}
        //get users flower
        if ($flowerid === null) {
            $flower = flower::fetch_newflower();
            $attempt->flowerid = $flower['id'];
        } else {
            $attempt->flowerid = $flowerid;
            $flower = flower::get_flower($flowerid);
        }

        $result = $DB->update_record(constants::M_USERTABLE, $attempt);
        if($result) {
            $returndata= $flower;
        }else{
            $message = 'unable to update attempt record';
        }
    }else{
        $message='no attempt of that id for that user';
    }
    return_to_page($result,$message,$returndata);
}


function process_reading_results($modulecontext,$filename,$rectime,$readseed)
{
//make database items and adhoc tasks
    $success = false;
    $message = '';
    $returndata=false;

    $attemptid = save_readingresults_to_moodle($filename, $rectime, $readseed);
    if ($attemptid) {
        if (\mod_readseed\utils::can_transcribe($readseed)) {
            $success = register_aws_task($readseed->id, $attemptid, $modulecontext->id);
            if (!$success) {
                $message = "Unable to create adhoc task to fetch transcriptions";
            }
        } else {
            $success = true;
        }
    } else {
        $message = "Unable to add update database with submission";
    }
    if($success){$returndata=$attemptid;}
    return_to_page($success,$message,$returndata);
}

//save the data to Moodle.
function save_readingresults_to_moodle($filename,$rectime, $readseed){
    global $USER,$DB;

    //Add a blank attempt with just the filename  and essential details
    $newattempt = new stdClass();
    $newattempt->courseid=$readseed->course;
    $newattempt->readseedid=$readseed->id;
    $newattempt->userid=$USER->id;
    $newattempt->status=0;
    $newattempt->filename=$filename;
    $newattempt->sessionscore=0;
    //$newattempt->sessiontime=$rectime;  //.. this would work. But sessiontime is used as flag of human has graded ...so needs more thought
    $newattempt->sessionerrors='';
    $newattempt->errorcount=0;
    $newattempt->wpm=0;
    $newattempt->timecreated=time();
    $newattempt->timemodified=time();
    $attemptid = $DB->insert_record(constants::M_USERTABLE,$newattempt);
    if(!$attemptid){
        return false;
    }
    $newattempt->id = $attemptid;

    //if we are machine grading we need an entry to AI table too
    //But ... there is the chance a user will CHANGE this value after submissions have begun,
    //If they do, INNER JOIN SQL in grade related logic will mess up gradebook if aigrade record is not available.
    //So for prudence sake we ALWAYS create an aigrade record
    if(true || $readseed->machgrademethod == constants::MACHINEGRADE_MACHINE) {
        aigrade::create_record($newattempt, $readseed->timelimit);
    }

    //return the attempt id
    return $attemptid;
}

//register an adhoc task to pick up transcripts
function register_aws_task($activityid, $attemptid,$modulecontextid){
    $s3_task = new \mod_readseed\task\readseed_s3_adhoc();
    $s3_task->set_component('mod_readseed');

    $customdata = new \stdClass();
    $customdata->activityid = $activityid;
    $customdata->attemptid = $attemptid;
    $customdata->modulecontextid = $modulecontextid;

    $s3_task->set_custom_data($customdata);
    // queue it
    \core\task\manager::queue_adhoc_task($s3_task);
    return true;
}

//handle return to Moodle
function return_to_page($success, $message=false,$data=false)
{
    $ret = new stdClass();
    $ret->success = $success;
    $ret->data=$data;
    $ret->message = $message;
    echo json_encode($ret);
}