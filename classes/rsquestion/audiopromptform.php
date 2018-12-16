<?php
/**
 * Created by PhpStorm.
 * User: ishineguy
 * Date: 2018/03/13
 * Time: 19:32
 */

namespace mod_readseed\rsquestion;

use \mod_readseed\constants;

class audiopromptform extends baseform
{

    public $type = constants::AUDIOCHOICE;
    public $typestring = constants::AUDIOCHOICE;
    public function custom_definition() {

        $this->add_audio_prompt_upload(get_string('addaudiopromptfile','readseed'));

        $this->add_audio_model_upload(get_string('addaudiomodelfile','readseed'));
    }

}