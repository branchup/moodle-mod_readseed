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
 * Grade Now for readseed plugin
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
class utils{

    //we need to consider legacy client side URLs and cloud hosted ones
    public static function make_audio_URL($filename, $contextid, $component, $filearea, $itemid){
        //we need to consider legacy client side URLs and cloud hosted ones
        if(strpos($filename,'http')===0){
            $ret = $filename;
        }else {
            $ret = \moodle_url::make_pluginfile_url($contextid, $component,
                $filearea,
                $itemid, '/',
                $filename);
        }
        return $ret;
    }

    //fetch a flower item for the completed attempt
    public static function fetch_newflower(){
        global $CFG, $USER;
        //TO DO
        //implement this properly by fetching a new flower for this user
        $flower= new \stdClass();
        $flower->id=1;
        $flower->name='mightyflower';
        $flower->picurl=$CFG->wwwroot .'/mod/readseed/flowers/' . $flower->id . '/mightyflower.png';
        return $flower;
    }

    //are we willing and able to transcribe submissions?
    public static function can_transcribe($instance)
    {
        //we default to true
        //but it only takes one no ....
        $ret = true;

        //The regions that can transcribe
        switch($instance->region){
            case "useast1":
            case "dublin":
            case "sydney":
            case "ottawa":
                break;
            default:
                $ret = false;
        }

        //if user disables ai, we do not transcribe
        if(!$instance->enableai){
            $ret =false;
        }

        return $ret;
    }

    //we use curl to fetch transcripts from AWS and Tokens from cloudpoodll
    //this is our helper
    //we use curl to fetch transcripts from AWS and Tokens from cloudpoodll
    //this is our helper
    public static function curl_fetch($url,$postdata=false)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        if ($postdata) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
        }
        $contents = curl_exec($ch);
        curl_close($ch);
        return $contents;
    }

    //This is called from the settings page and we do not want to make calls out to cloud.poodll.com on settings
    //page load, for performance and stability issues. So if the cache is empty and/or no token, we just show a
    //"refresh token" links
    public static function fetch_token_for_display($apiuser,$apisecret){
       global $CFG;

       //First check that we have an API id and secret
        //refresh token
        $refresh = \html_writer::link($CFG->wwwroot . '/mod/readseed/refreshtoken.php',
                get_string('refreshtoken',constants::M_COMPONENT)) . '<br>';


        $message = '';
        $apiuser = trim($apiuser);
        $apisecret = trim($apisecret);
        if(empty($apiuser)){
           $message .= get_string('noapiuser',constants::M_COMPONENT) . '<br>';
       }
        if(empty($apisecret)){
            $message .= get_string('noapisecret',constants::M_COMPONENT);
        }

        if(!empty($message)){
            return $refresh . $message;
        }

        //Fetch from cache and process the results and display
        $cache = \cache::make_from_params(\cache_store::MODE_APPLICATION, constants::M_COMPONENT, 'token');
        $tokenobject = $cache->get('recentpoodlltoken');

        //if we have no token object the creds were wrong ... or something
        if(!($tokenobject)){
            $message = get_string('notokenincache',constants::M_COMPONENT);
            //if we have an object but its no good, creds werer wrong ..or something
        }elseif(!property_exists($tokenobject,'token') || empty($tokenobject->token)){
            $message = get_string('credentialsinvalid',constants::M_COMPONENT);
        //if we do not have subs, then we are on a very old token or something is wrong, just get out of here.
        }elseif(!property_exists($tokenobject,'subs')){
            $message = 'No subscriptions found at all';
        }
        if(!empty($message)){
            return $refresh . $message;
        }

        //we have enough info to display a report. Lets go.
        foreach ($tokenobject->subs as $sub){
            $sub->expiredate = date('d/m/Y',$sub->expiredate);
            $message .= get_string('displaysubs',constants::M_COMPONENT, $sub) . '<br>';
        }
        //Is app authorised
        if(in_array(constants::M_COMPONENT,$tokenobject->apps)){
            $message .= get_string('appauthorised',constants::M_COMPONENT) . '<br>';
        }else{
            $message .= get_string('appnotauthorised',constants::M_COMPONENT) . '<br>';
        }

        return $refresh . $message;

    }

    //We need a Poodll token to make all this recording and transcripts happen
    public static function fetch_token($apiuser, $apisecret, $force=false)
    {

        $cache = \cache::make_from_params(\cache_store::MODE_APPLICATION, constants::M_COMPONENT, 'token');
        $tokenobject = $cache->get('recentpoodlltoken');
        $tokenuser = $cache->get('recentpoodlluser');
        $apiuser = trim($apiuser);
        $apisecret = trim($apisecret);
        $now = time();

        //if we got a token and its less than expiry time
        // use the cached one
        if($tokenobject && $tokenuser && $tokenuser==$apiuser && !$force){
            if($tokenobject->validuntil == 0 || $tokenobject->validuntil > $now){
               // $hoursleft= ($tokenobject->validuntil-$now) / (60*60);
                return $tokenobject->token;
            }
        }

        // Send the request & save response to $resp
        $token_url ="https://cloud.poodll.com/local/cpapi/poodlltoken.php";
        $postdata = array(
            'username' => $apiuser,
            'password' => $apisecret,
            'service'=>'cloud_poodll'
        );
        $token_response = self::curl_fetch($token_url,$postdata);
        if ($token_response) {
            $resp_object = json_decode($token_response);
            if($resp_object && property_exists($resp_object,'token')) {
                $token = $resp_object->token;
                //store the expiry timestamp and adjust it for diffs between our server times
                if($resp_object->validuntil) {
                    $validuntil = $resp_object->validuntil - ($resp_object->poodlltime - $now);
                    //we refresh one hour out, to prevent any overlap
                    $validuntil = $validuntil - (1 * HOURSECS);
                }else{
                    $validuntil = 0;
                }

                $tillrefreshhoursleft= ($validuntil-$now) / (60*60);


                //cache the token
                $tokenobject = new \stdClass();
                $tokenobject->token = $token;
                $tokenobject->validuntil = $validuntil;
                $tokenobject->subs=false;
                $tokenobject->apps=false;
                $tokenobject->sites=false;
                if(property_exists($resp_object,'subs')){
                    $tokenobject->subs = $resp_object->subs;
                }
                if(property_exists($resp_object,'apps')){
                    $tokenobject->apps = $resp_object->apps;
                }
                if(property_exists($resp_object,'sites')){
                    $tokenobject->sites = $resp_object->sites;
                }

                $cache->set('recentpoodlltoken', $tokenobject);
                $cache->set('recentpoodlluser', $apiuser);

            }else{
                $token = '';
                if($resp_object && property_exists($resp_object,'error')) {
                    //ERROR = $resp_object->error
                }
            }
        }else{
            $token='';
        }
        return $token;
    }

    public static function fetch_duration_from_transcript($fulltranscript){
        $transcript = json_decode($fulltranscript);
        $titems=$transcript->results->items;
        $twords=array();
        foreach($titems as $titem){
            if($titem->type == 'pronunciation'){
                $twords[] = $titem;
            }
        }
        $lastindex = count($twords);
        if($lastindex>0){
            return $twords[$lastindex-1]->end_time;
        }else{
            return 0;
        }
    }

    //fetch start-time and end-time points for each word
    public static function fetch_audio_points($fulltranscript,$matches,$alternatives){

       //get type 'pronunciation' items from full transcript. The other type is 'punctuation'.
        $transcript = json_decode($fulltranscript);
        $titems=$transcript->results->items;
        $twords=array();
        foreach($titems as $titem){
            if($titem->type == 'pronunciation'){
                $twords[] = $titem;
            }
        }
        $twordcount=count($twords);

        //loop through matches and fetch audio start from word item
        foreach ($matches as $matchitem){
            if($matchitem->tposition <= $twordcount){
                //pull the word data object from the full transcript, at the index of the match
                $tword = $twords[$matchitem->tposition - 1];

                //trust or be sure by matching ...
                $trust = false;
                if($trust){
                    $matchitem->audiostart = $tword->start_time;
                    $matchitem->audioend = $tword->end_time;
                }else {
                    //format the text of the word to lower case no punc, to match the word in the matchitem
                    $tword_text = strtolower($tword->alternatives[0]->content);
                    $tword_text = preg_replace("#[[:punct:]]#", "", $tword_text);
                    //if we got it, fetch the audio position from the word data object
                    if ($matchitem->word == $tword_text) {
                        $matchitem->audiostart = $tword->start_time;
                        $matchitem->audioend = $tword->end_time;

                    //do alternatives search for match
                    }elseif(diff::check_alternatives_for_match($matchitem->word,
                        $tword_text,
                        $alternatives)){
                        $matchitem->audiostart = $tword->start_time;
                        $matchitem->audioend = $tword->end_time;
                    }
                }
            }
        }
        return $matches;
    }

    //this is a server side implementation of the same name function in gradenowhelper.js
    //we need this when calculating adjusted grades(reports/machinegrading.php) and on making machine grades(aigrade.php)
    //the WPM adjustment based on accadjust only applies to machine grades, so it is NOT in gradenowhelper
    public static function processscores($sessiontime,$sessionendword,$errorcount,$activitydata){

        ////wpm score
        $wpmerrors = $errorcount;
        switch($activitydata->accadjustmethod){

            case constants::ACCMETHOD_FIXED:
                $wpmerrors = $wpmerrors - $activitydata->accadjust;
                if($wpmerrors < 0){$wpmerrors=0;}
                break;

            case constants::ACCMETHOD_NOERRORS:
                $wpmerrors = 0;
                break;

            case constants::ACCMETHOD_AUTO:
                $adjust= \mod_readseed\utils::estimate_errors($activitydata->id);
                $wpmerrors = $wpmerrors - $adjust;
                if($wpmerrors < 0){$wpmerrors=0;}
                break;

            case constants::ACCMETHOD_NONE:
            default:
                $wpmerrors = $errorcount;
                break;
        }
        if($sessiontime > 0) {
            $wpmscore = round(($sessionendword - $wpmerrors) * 60 / $sessiontime);
        }else{
            $wpmscore =0;
        }

        //accuracy score
        if($sessionendword > 0) {
            $accuracyscore = round(($sessionendword - $errorcount) / $sessionendword * 100);
        }else{
            $accuracyscore=0;
        }

        //sessionscore
        $usewpmscore = $wpmscore;
        $targetwpm = $activitydata->targetwpm;
        if($usewpmscore > $targetwpm){
            $usewpmscore = $targetwpm;
        }
        $sessionscore = round($usewpmscore/$targetwpm * 100);

        $scores= new \stdClass();
        $scores->wpmscore = $wpmscore;
        $scores->accuracyscore = $accuracyscore;
        $scores->sessionscore=$sessionscore;
        return $scores;

    }

    //take a json string of session errors, anmd count how many there are.
    public static function count_sessionerrors($sessionerrors){
        $errors = json_decode($sessionerrors);
        if($errors){
            $errorcount = count(get_object_vars($errors));
        }else{
            $errorcount=0;
        }
        return $errorcount;
    }

    //get all the aievaluations for a user
    public static function get_aieval_byuser($readseedid,$userid){
        global $DB;
        $sql = "SELECT tai.*  FROM {" . constants::M_AITABLE . "} tai INNER JOIN  {" . constants::M_USERTABLE . "}" .
            " tu ON tu.id =tai.attemptid AND tu.readseedid=tai.readseedid WHERE tu.readseedid=? AND tu.userid=?";
        $result = $DB->get_records_sql($sql,array($readseedid,$userid));
        return $result;
    }

    //get average difference between human graded attempt error count and AI error count
    //we only fetch if A) have machine grade and B) sessiontime> 0(has been manually graded)
    public static function estimate_errors($readseedid){
        global $DB;
        $errorestimate =0;
        $sql = "SELECT AVG(tai.errorcount - tu.errorcount) as errorestimate  FROM {" . constants::M_AITABLE . "} tai INNER JOIN  {" . constants::M_USERTABLE . "}" .
            " tu ON tu.id =tai.attemptid AND tu.readseedid=tai.readseedid WHERE tu.sessiontime > 0 AND tu.readseedid=?";
        $result = $DB->get_field_sql($sql,array($readseedid));
        if($result!==false){
            $errorestimate = round($result);
        }
        return $errorestimate;
    }

    /**
     * Returns the link for the related activity
     * @return string
     */
    public static function fetch_next_activity($activitylink) {
        global $DB;
        $ret = new \stdClass();
        $ret->url=false;
        $ret->label=false;
        if(!$activitylink){
            return $ret;
        }

        $module = $DB->get_record('course_modules', array('id' => $activitylink));
        if ($module) {
            $modname = $DB->get_field('modules', 'name', array('id' => $module->module));
            if ($modname) {
                $instancename = $DB->get_field($modname, 'name', array('id' => $module->instance));
                if ($instancename) {
                    $ret->url = new \moodle_url('/mod/'.$modname.'/view.php', array('id' => $activitylink));
                    $ret->label = get_string('activitylinkname',constants::M_COMPONENT, $instancename);
                }
            }
        }
        return $ret;
    }

    //What to show students after an attempt
    public static function get_postattempt_options(){
        return array(
            constants::POSTATTEMPT_NONE => get_string("postattempt_none",constants::M_COMPONENT),
            constants::POSTATTEMPT_EVAL  => get_string("postattempt_eval",constants::M_COMPONENT),
            constants::POSTATTEMPT_EVALERRORS  => get_string("postattempt_evalerrors",constants::M_COMPONENT)
        );
    }

    //for error estimate and accuracy adjustment, we can auto estimate errors, never estimate errors, or use a fixed error estimate, or ignore errors
    public static function get_accadjust_options(){
        return array(
            constants::ACCMETHOD_NONE => get_string("accmethod_none",constants::M_COMPONENT),
            //constants::ACCMETHOD_AUTO  => get_string("accmethod_auto",constants::M_COMPONENT),
            constants::ACCMETHOD_FIXED  => get_string("accmethod_fixed",constants::M_COMPONENT),
            constants::ACCMETHOD_NOERRORS  => get_string("accmethod_noerrors",constants::M_COMPONENT),
        );
    }

  public static function get_region_options(){
      return array(
        "useast1" => get_string("useast1",constants::M_COMPONENT),
          "tokyo" => get_string("tokyo",constants::M_COMPONENT),
          "sydney" => get_string("sydney",constants::M_COMPONENT),
          "dublin" => get_string("dublin",constants::M_COMPONENT),
          "ottawa" => get_string("ottawa",constants::M_COMPONENT),
          "frankfurt" => get_string("frankfurt",constants::M_COMPONENT),
          "london" => get_string("london",constants::M_COMPONENT),
          "saopaulo" => get_string("saopaulo",constants::M_COMPONENT),
      );
  }

    public static function get_machinegrade_options(){
        return array(
            constants::MACHINEGRADE_NONE => get_string("machinegradenone",constants::M_COMPONENT),
            constants::MACHINEGRADE_MACHINE => get_string("machinegrademachine",constants::M_COMPONENT)
        );
    }

    public static function get_timelimit_options(){
        return array(
            0 => get_string("notimelimit",constants::M_COMPONENT),
            30 => get_string("xsecs",constants::M_COMPONENT,'30'),
            45 => get_string("xsecs",constants::M_COMPONENT,'45'),
            60 => get_string("onemin",constants::M_COMPONENT),
            90 => get_string("oneminxsecs",constants::M_COMPONENT,'30'),
            120 => get_string("xmins",constants::M_COMPONENT,'2'),
            150 => get_string("xminsecs",constants::M_COMPONENT,array('minutes'=>2,'seconds'=>30)),
            180 => get_string("xmins",constants::M_COMPONENT,'3')
        );
    }

  public static function get_expiredays_options(){
      return array(
          "1"=>"1",
          "3"=>"3",
          "7"=>"7",
          "30"=>"30",
          "90"=>"90",
          "180"=>"180",
          "365"=>"365",
          "730"=>"730",
          "9999"=>get_string('forever',constants::M_COMPONENT)
      );
  }

   public static function get_lang_options(){
       return array(
            'en-US'=>get_string('en-us',constants::M_COMPONENT),
           'en-UK'=>get_string('en-uk',constants::M_COMPONENT),
           'en-AU'=>get_string('en-au',constants::M_COMPONENT),
           'es-US'=>get_string('es-us',constants::M_COMPONENT),
           'fr-CA'=>get_string('fr-ca',constants::M_COMPONENT),
       );
	/*
      return array(
			"none"=>"No TTS",
			"af"=>"Afrikaans", 
			"sq"=>"Albanian", 
			"am"=>"Amharic", 
			"ar"=>"Arabic", 
			"hy"=>"Armenian", 
			"az"=>"Azerbaijani", 
			"eu"=>"Basque", 
			"be"=>"Belarusian", 
			"bn"=>"Bengali", 
			"bh"=>"Bihari", 
			"bs"=>"Bosnian", 
			"br"=>"Breton", 
			"bg"=>"Bulgarian", 
			"km"=>"Cambodian", 
			"ca"=>"Catalan", 
			"zh-CN"=>"Chinese (Simplified)", 
			"zh-TW"=>"Chinese (Traditional)", 
			"co"=>"Corsican", 
			"hr"=>"Croatian", 
			"cs"=>"Czech", 
			"da"=>"Danish", 
			"nl"=>"Dutch", 
			"en"=>"English", 
			"eo"=>"Esperanto", 
			"et"=>"Estonian", 
			"fo"=>"Faroese", 
			"tl"=>"Filipino", 
			"fi"=>"Finnish", 
			"fr"=>"French", 
			"fy"=>"Frisian", 
			"gl"=>"Galician", 
			"ka"=>"Georgian", 
			"de"=>"German", 
			"el"=>"Greek", 
			"gn"=>"Guarani", 
			"gu"=>"Gujarati", 
			"xx-hacker"=>"Hacker", 
			"ha"=>"Hausa", 
			"iw"=>"Hebrew", 
			"hi"=>"Hindi", 
			"hu"=>"Hungarian", 
			"is"=>"Icelandic", 
			"id"=>"Indonesian", 
			"ia"=>"Interlingua", 
			"ga"=>"Irish", 
			"it"=>"Italian", 
			"ja"=>"Japanese", 
			"jw"=>"Javanese", 
			"kn"=>"Kannada", 
			"kk"=>"Kazakh", 
			"rw"=>"Kinyarwanda", 
			"rn"=>"Kirundi", 
			"xx-klingon"=>"Klingon", 
			"ko"=>"Korean", 
			"ku"=>"Kurdish", 
			"ky"=>"Kyrgyz", 
			"lo"=>"Laothian", 
			"la"=>"Latin", 
			"lv"=>"Latvian", 
			"ln"=>"Lingala", 
			"lt"=>"Lithuanian", 
			"mk"=>"Macedonian", 
			"mg"=>"Malagasy", 
			"ms"=>"Malay", 
			"ml"=>"Malayalam", 
			"mt"=>"Maltese", 
			"mi"=>"Maori", 
			"mr"=>"Marathi", 
			"mo"=>"Moldavian", 
			"mn"=>"Mongolian", 
			"sr-ME"=>"Montenegrin", 
			"ne"=>"Nepali", 
			"no"=>"Norwegian", 
			"nn"=>"Norwegian(Nynorsk)", 
			"oc"=>"Occitan", 
			"or"=>"Oriya", 
			"om"=>"Oromo", 
			"ps"=>"Pashto", 
			"fa"=>"Persian", 
			"xx-pirate"=>"Pirate", 
			"pl"=>"Polish", 
			"pt-BR"=>"Portuguese(Brazil)", 
			"pt-PT"=>"Portuguese(Portugal)", 
			"pa"=>"Punjabi", 
			"qu"=>"Quechua", 
			"ro"=>"Romanian", 
			"rm"=>"Romansh", 
			"ru"=>"Russian", 
			"gd"=>"Scots Gaelic", 
			"sr"=>"Serbian", 
			"sh"=>"Serbo-Croatian", 
			"st"=>"Sesotho", 
			"sn"=>"Shona", 
			"sd"=>"Sindhi", 
			"si"=>"Sinhalese", 
			"sk"=>"Slovak", 
			"sl"=>"Slovenian", 
			"so"=>"Somali", 
			"es"=>"Spanish", 
			"su"=>"Sundanese", 
			"sw"=>"Swahili", 
			"sv"=>"Swedish", 
			"tg"=>"Tajik", 
			"ta"=>"Tamil", 
			"tt"=>"Tatar", 
			"te"=>"Telugu", 
			"th"=>"Thai", 
			"ti"=>"Tigrinya", 
			"to"=>"Tonga", 
			"tr"=>"Turkish", 
			"tk"=>"Turkmen", 
			"tw"=>"Twi", 
			"ug"=>"Uighur", 
			"uk"=>"Ukrainian", 
			"ur"=>"Urdu", 
			"uz"=>"Uzbek", 
			"vi"=>"Vietnamese", 
			"cy"=>"Welsh", 
			"xh"=>"Xhosa", 
			"yi"=>"Yiddish", 
			"yo"=>"Yoruba", 
			"zu"=>"Zulu"
		);
	*/
   }
}
