<?php
/**
 * Created by PhpStorm.
 * User: ishineguy
 * Date: 2018/03/13
 * Time: 19:31
 */

namespace mod_readseed\rsquestion;

use \mod_readseed\constants;

class picturepromptform extends baseform
{
    public $type =  constants::PICTURECHOICE;
    public $typestring = constants::PICTURECHOICE;

    public function custom_definition() {

        $this->add_picture_item_upload(get_string('pictureitemfile','readseed'));

    }
}