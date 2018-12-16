define(['jquery','core/log'], function($,log) {
    "use strict"; // jshint ;_;

/*
This file contains class and ID definitions.
 */

    log.debug('Read Seed definitions: initialising');

    return{
        component: 'mod_readseed',
        //hidden player
        hiddenplayer: 'mod_readseed_hidden_player',
        hiddenplayerbutton: 'mod_readseed_hidden_player_button',
        hiddenplayerbuttonactive: 'mod_readseed_hidden_player_button_active',
        hiddenplayerbuttonpaused: 'mod_readseed_hidden_player_button_paused',
        hiddenplayerbuttonplaying: 'mod_readseed_hidden_player_button_playing',

        //popover
        okbuttonclass: 'mod_readseed_quickgrade_ok',
        ngbuttonclass: 'mod_readseed_quickgrade_ng',
        quickgradecontainerclass: 'mod_readseed_quickgrade_cont',

        //grade now
        passagecontainer: 'mod_readseed_grading_passagecont',
        audioplayerclass: 'mod_readseed_grading_player',
        wordplayerclass: 'mod_readseed_hidden_player',
        wordclass: 'mod_readseed_grading_passageword',
        spaceclass: 'mod_readseed_grading_passagespace',
        badwordclass: 'mod_readseed_grading_badword',
        endspaceclass: 'mod_readseed_grading_endspace',
        unreadwordclass:  'mod_readseed_grading_unreadword',
        wpmscoreid: 'mod_readseed_grading_wpm_score',
        accuracyscoreid: 'mod_readseed_grading_accuracy_score',
        sessionscoreid: 'mod_readseed_grading_session_score',
        errorscoreid: 'mod_readseed_grading_error_score',
        formelementwpmscore: 'mod_readseed_grading_form_wpm',
        formelementaccuracy: 'mod_readseed_grading_form_accuracy',
        formelementsessionscore: 'mod_readseed_grading_form_sessionscore',
        formelementendword: 'mod_readseed_grading_form_sessionendword',
        formelementtime: 'mod_readseed_grading_form_sessiontime',
        formelementerrors: 'mod_readseed_grading_form_sessionerrors',
        modebutton: 'mod_readseed_modebutton',

        //activity
        passagefinished: 'mod_readseed_passage_finished',
        spotcheckbutton: 'mod_readseed_spotcheckbutton',
        transcriptcheckbutton: 'mod_readseed_transcriptcheckbutton',
        gradingbutton: 'mod_readseed_gradingbutton',
        clearbutton: 'mod_readseed_clearbutton',
        spotcheckmode: 'mod_readseed_spotcheckmode',
        aiunmatched: 'mod_readseed_aiunmatched',

        //quiz
        qtype_pictureprompt: '1',
        qtype_audioprompt: '2',
        qtype_textpromptlong: '4',
        qtype_textpromptshort: '5',
        qtype_textpromptaudio: '6',
    };//end of return value
});