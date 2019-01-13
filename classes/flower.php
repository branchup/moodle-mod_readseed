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
 * Flower handler for readseed plugin
 *
 * @package    mod_readseed
 * @copyright  2015 Justin Hunt (poodllsupport@gmail.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
 namespace mod_readseed;
defined('MOODLE_INTERNAL') || die();

use \mod_readseed\constants;


/**
 * Functions used generally across this mod
 *
 * @package    mod_readseed
 * @copyright  2015 Justin Hunt (poodllsupport@gmail.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class flower{


    //fetch a flower item for the completed attempt
    public static function fetch_newflower(){
        global $CFG, $USER,$DB;
        $flowers = self::fetch_flowers();
        $used_flowerids = $DB->get_fieldset_select(constants::M_USERTABLE, 'flowerid', 'userid =:userid', array('userid'=>$USER->id));
        //if we have used flowers and we have not used all our flowers, we reduce the flowers array to the ones we have not allocated yet
        if($used_flowerids){
            if(count($used_flowerids)< count($flowers)) {
                foreach ($used_flowerids as $used_flowerid) {
                    $flowers.splice($used_flowerid, 1);
                }
            }
        }
        $flowerid = array_rand($flowers);
        $flower= $flowers[$flowerid];
        $flower['picurl']=$CFG->wwwroot .'/mod/readseed/flowers/' . $flower['id']. '/p_' . $flower['name'] . '.png';
        return $flower;
    }
    public static function fetch_flowers(){
        return array(
            0=>array('id'=>0,'name'=>'ninja'),
            1=>array('id'=>1,'name'=>'cat'),
            2=>array('id'=>2,'name'=>'pippi'),
            3=>array('id'=>3,'name'=>'robot'),
            4=>array('id'=>4,'name'=>'carracer')
        );
    }
}
