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
 * Reports for readseed
 *
 *
 * @package    mod_readseed
 * @copyright  2015 Justin Hunt (poodllsupport@gmail.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


require_once(dirname(dirname(dirname(__FILE__))).'/config.php');

use \mod_readseed\constants;
use \mod_readseed\utils;

$id = optional_param('id', 0, PARAM_INT); // course_module ID, or
$n  = optional_param('n', 0, PARAM_INT);  // readseed instance ID
$action = optional_param('action', 'menu', PARAM_TEXT);



if ($id) {
    $cm         = get_coursemodule_from_id(constants::M_MODNAME, $id, 0, false, MUST_EXIST);
    $course     = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
    $moduleinstance  = $DB->get_record(constants::M_TABLE, array('id' => $cm->instance), '*', MUST_EXIST);
} elseif ($n) {
    $moduleinstance  = $DB->get_record(constants::M_TABLE, array('id' => $n), '*', MUST_EXIST);
    $course     = $DB->get_record('course', array('id' => $moduleinstance->course), '*', MUST_EXIST);
    $cm         = get_coursemodule_from_instance(constants::M_TABLE, $moduleinstance->id, $course->id, false, MUST_EXIST);
} else {
    error('You must specify a course_module ID or an instance ID');
}

$PAGE->set_url(constants::M_URL . '/gradesadmin.php',
	array('id' => $cm->id));
require_login($course, true, $cm);
$modulecontext = context_module::instance($cm->id);

require_capability('mod/readseed:manage', $modulecontext);

//Get an admin settings 
$config = get_config(constants::M_COMPONENT);


switch($action){

    case 'machineregradeall':
        $url =  new \moodle_url(constants::M_URL . '/gradesadmin.php',
            array('id' => $cm->id,
                'action'=>'menu'));
        $ai_evals = $DB->get_records(constants::M_AITABLE,array('readseedid'=>$moduleinstance->id));
        if(!$ai_evals) {
            redirect($url,get_string('noattemptsregrade',constants::M_COMPONENT));
        }else{
            $skipped=0;
            foreach($ai_evals as $eval){
                $aigrade = new \mod_readseed\aigrade($eval->attemptid,$modulecontext->id);
                if($aigrade->has_transcripts()) {
                    $aigrade->do_diff();
                }else{
                    $skipped++;
                }
            }
            $results=new stdClass();
            $results->done=count($ai_evals)-$skipped;
            $results->skipped=$skipped;
            redirect($url,get_string('machineregraded',constants::M_COMPONENT,$results),5);
        }
        break;
    case 'pushmachinegrades':
        $url =  new \moodle_url(constants::M_URL . '/gradesadmin.php',
            array('id' => $cm->id,
                'action'=>'menu'));
        if($moduleinstance->machgrademethod == constants::MACHINEGRADE_MACHINE &&
            utils::can_transcribe($moduleinstance)) {
            readseed_update_grades($moduleinstance);
        }
        redirect($url,get_string('machinegradespushed',constants::M_COMPONENT),5);
        break;

    case 'menu':
    default:

}

/// Set up the page header
$PAGE->set_title(format_string($moduleinstance->name));
$PAGE->set_heading(format_string($course->fullname));
$PAGE->set_context($modulecontext);
$PAGE->set_pagelayout('course');
$mode = "gradesadmin";

//This puts all our display logic into the renderer.php files in this plugin
$renderer = $PAGE->get_renderer(constants::M_COMPONENT);

echo $renderer->header($moduleinstance, $cm, $mode, null, get_string('gradesadmin', constants::M_COMPONENT));

echo $renderer->show_gradesadmin_heading(get_string('gradesadmintitle',constants::M_COMPONENT),
    get_string('gradesadmininstructions',constants::M_COMPONENT));
echo $renderer->show_currenterrorestimate( \mod_readseed\utils::estimate_errors($moduleinstance->id));
echo $renderer->show_machineregradeallbutton($moduleinstance);
echo $renderer->show_pushmachinegradesbutton($moduleinstance);


echo $renderer->footer();
return;
