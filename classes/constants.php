<?php
/**
 * Created by PhpStorm.
 * User: ishineguy
 * Date: 2018/06/16
 * Time: 19:31
 */

namespace mod_readseed;

defined('MOODLE_INTERNAL') || die();

class constants
{
//component name, db tables, things that define app
const M_COMPONENT='mod_readseed';
const M_FILEAREA_SUBMISSIONS='submission';
const M_TABLE='readseed';
const M_USERTABLE='readseed_attempt';
const M_AITABLE='readseed_ai_result';
const M_QTABLE='readseed_rsquestions';
const M_MODNAME='readseed';
const M_URL='/mod/readseed';
const M_CLASS='mod_readseed';

//grading options
const M_GRADEHIGHEST= 0;
const M_GRADELOWEST= 1;
const M_GRADELATEST= 2;
const M_GRADEAVERAGE= 3;
const M_GRADENONE= 4;
//accuracy adjustment method options
const ACCMETHOD_NONE =0;
const ACCMETHOD_AUTO =1;
const ACCMETHOD_FIXED =2;
const ACCMETHOD_NOERRORS =3;
//what to display to user when reviewing activity options
const POSTATTEMPT_NONE=0;
const POSTATTEMPT_EVAL=1;
const POSTATTEMPT_EVALERRORS=2;
//more review mode options
const REVIEWMODE_NONE=0;
const REVIEWMODE_MACHINE=1;
const REVIEWMODE_HUMAN=2;
const REVIEWMODE_SCORESONLY=3;
//to use or not use machine grades
const MACHINEGRADE_NONE=0;
const MACHINEGRADE_MACHINE=1;

//Constants for RS Questions
const NONE=0;
const TYPE_PICTUREPROMPT= 1;
const TYPE_AUDIOPROMPT = 2 ;
const TYPE_TEXTPROMPT_LONG = 4;
const TYPE_TEXTPROMPT_SHORT = 5;
const TYPE_TEXTPROMPT_AUDIO = 6;
const TYPE_INSTRUCTIONS = 7;
const TEXTCHOICE = 'textchoice';
const TEXTBOXCHOICE = 'textboxchoice';
const PICTURECHOICE= 'picturechoice';
const AUDIOCHOICE = 'picturechoice';
const AUDIORESPONSE = 'audioresponse';
const AUDIOFNAME = 'itemaudiofname';
const AUDIOPROMPT = 'audioitem';
const AUDIOANSWER = 'audioanswer';
const AUDIOMODEL = 'audiomodel';
const CORRECTANSWER = 'correctanswer';
const AUDIOPROMPT_FILEAREA = 'audioitem';
const AUDIOMODEL_FILEAREA = 'audiomodel';
const AUDIOANSWER_FILEAREA = 'audioanswer';
const PICTUREPROMPT = 'pictureitem';
const PICTUREPROMPT_FILEAREA = 'pictureitem';
const TEXTPROMPT_FILEAREA = 'textitem';
const TEXTQUESTION = 'itemtext';
const TEXTANSWER = 'customtext';
const TEXTQUESTION_FILEAREA = 'itemarea';
const TEXTANSWER_FILEAREA ='answerarea';
const PASSAGEPICTURE='passagepicture';
const PASSAGEPICTURE_FILEAREA = 'passagepicture';
const MAXANSWERS=4;

//CSS ids/classes
const M_RECORD_BUTTON='mod_readseed_record_button';
const M_START_BUTTON='mod_readseed_start_button';
const M_READING_AUDIO_URL='mod_readseed_readingaudiourl';
const M_DRAFT_CONTROL='mod_readseed_draft_control';
const M_PROGRESS_CONTAINER='mod_readseed_progress_cont';
const M_HIDER='mod_readseed_hider';
const M_STOP_BUTTON='mod_readseed_stop_button';
const M_WHERETONEXT_CONTAINER='mod_readseed_wheretonext_cont';
const M_RECORD_BUTTON_CONTAINER='mod_readseed_record_button_cont';
const M_START_BUTTON_CONTAINER='mod_readseed_start_button_cont';
const M_STOP_BUTTON_CONTAINER='mod_readseed_stop_button_cont';
const M_RECORDERID='therecorderid';
const M_RECORDING_CONTAINER='mod_readseed_recording_cont';
const M_RECORDER_CONTAINER='mod_readseed_recorder_cont';
const M_DUMMY_RECORDER='mod_readseed_dummy_recorder';
const M_RECORDER_INSTRUCTIONS_RIGHT='mod_readseed_recorder_instr_right';
const M_RECORDER_INSTRUCTIONS_LEFT='mod_readseed_recorder_instr_left';
const M_INSTRUCTIONS_CONTAINER='mod_readseed_instructions_cont';
const M_PASSAGE_CONTAINER='mod_readseed_passage_cont';
const M_QUIZ_CONTAINER='mod_readseed_quiz_cont';
const M_POSTATTEMPT= 'mod_readseed_postattempt';
const M_FEEDBACK_CONTAINER='mod_readseed_feedback_cont';
const M_ERROR_CONTAINER='mod_readseed_error_cont';
const M_GRADING_ERROR_CONTAINER='mod_readseed_grading_error_cont';
const M_GRADING_ERROR_IMG='mod_readseed_grading_error_img';
const M_GRADING_ERROR_SCORE='mod_readseed_grading_error_score';
const M_GRADING_WPM_CONTAINER='mod_readseed_grading_wpm_cont';
const M_GRADING_WPM_IMG='mod_readseed_grading_wpm_img';
const M_GRADING_WPM_SCORE='mod_readseed_grading_wpm_score';
const M_GRADING_ACCURACY_CONTAINER='mod_readseed_grading_accuracy_cont';
const M_GRADING_ACCURACY_IMG='mod_readseed_grading_accuracy_img';
const M_GRADING_ACCURACY_SCORE='mod_readseed_grading_accuracy_score';
const M_GRADING_SESSION_SCORE='mod_readseed_grading_session_score';
const M_GRADING_SESSIONSCORE_CONTAINER='mod_readseed_grading_sessionscore_cont';
const M_GRADING_SCORE='mod_readseed_grading_score';
const M_GRADING_PLAYER_CONTAINER='mod_readseed_grading_player_cont';
const M_GRADING_PLAYER='mod_readseed_grading_player';
const M_GRADING_ACTION_CONTAINER='mod_readseed_grading_action_cont';
const M_GRADING_FORM_SESSIONTIME='mod_readseed_grading_form_sessiontime';
const M_GRADING_FORM_SESSIONSCORE='mod_readseed_grading_form_sessionscore';
const M_GRADING_FORM_WPM='mod_readseed_grading_form_wpm';
const M_GRADING_FORM_ACCURACY='mod_readseed_grading_form_accuracy';
const M_GRADING_FORM_SESSIONENDWORD='mod_readseed_grading_form_sessionendword';
const M_GRADING_FORM_SESSIONERRORS='mod_readseed_grading_form_sessionerrors';
const M_GRADESADMIN_CONTAINER='mod_readseed_gradesadmin_cont';
const M_HIDDEN_PLAYER='mod_readseed_hidden_player';
const M_HIDDEN_PLAYER_BUTTON='mod_readseed_hidden_player_button';
const M_HIDDEN_PLAYER_BUTTON_ACTIVE='mod_readseed_hidden_player_button_active';
const M_HIDDEN_PLAYER_BUTTON_PAUSED='mod_readseed_hidden_player_button_paused';
const M_HIDDEN_PLAYER_BUTTON_PLAYING='mod_readseed_hidden_player_button_playing';
const M_EVALUATED_MESSAGE='mod_readseed_evaluated_message';
}