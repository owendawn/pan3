<?php
/**
 * Created by PhpStorm.
 * User: owen pan
 * Date: 2017/1/4
 * Time: 16:46
 */
require_once __DIR__."/../utils/SqliteUtil.php";
require_once __DIR__."/../utils/UUIDUtil.php";
require_once __DIR__."/../utils/JwtUtil.php";

ini_set("memory_limit", "10240M");
require_once __DIR__ . '/../lib/phpspider/autoloader.php';
use phpspider\core\phpspider;
use phpspider\core\requests;
use phpspider\core\selector;

class VideoController 
{
    public function getVideoOfAvailable()
    {
        $sEcho = isset($_REQUEST["sEcho"])?$_REQUEST["sEcho"]:null;
        $sortColIndex = isset($_REQUEST["iSortCol_0"])?$_REQUEST["iSortCol_0"]:null;
        $sortType = isset($_REQUEST["sSortDir_0"])?$_REQUEST["sSortDir_0"]:null;
        $sortCol = isset($_REQUEST["mDataProp_" . $sortColIndex])?$_REQUEST["mDataProp_" . $sortColIndex]:null;
        $start = isset($_REQUEST["iDisplayStart"])?$_REQUEST["iDisplayStart"]:null;
        $length = isset($_REQUEST["iDisplayLength"])?$_REQUEST["iDisplayLength"]:null;
        if (isset($_REQUEST["token"])) {
            $token = $_REQUEST["token"];
            $jwtUtil = new JwtUtil();
            $jwt=$jwtUtil->parseJwt($token);
            
            $userId = $jwt->id;
            $infos = [];
            try {
                $sqliteUtil = new SqliteUtil();
                $db = $sqliteUtil->getDB();

                $ps = $db->prepare("select count(1) as cnt from videos where status=0 and userid=:userid");
                $ps->bindParam(":userid" , $userId);
                $rs=$ps->execute();
                if ($rs->numColumns() ) {
                    $cnt = $rs->fetchArray()["cnt"];
                    if ($cnt > 0) {
                        if ($start == "") {
                            $ps = $db->prepare("select * from videos where status=0 and userid=:userid order by week asc");
                            $ps->bindParam(":userid" , $userId);
                            $rs=$ps->execute();
                        } else {
                            $ps = $db->prepare("select * from videos where status=0 and userid=:userid order by " . $sortCol . " " . $sortType . " LIMIT :start,:length ");
                            $ps->bindParam(":start" , $start);
                            $ps->bindParam( ":length", $length);
                            $ps->bindParam( ":userid" , $userId);
                            $rs=$ps->execute();
                        }

                        $row = array(); 
                        $i = 0; 
                        while($res = $rs->fetchArray(SQLITE3_ASSOC)){ 
                             $row[$i]=$res; 
                             $i++; 
                         } 
                    }
                    return array("aaData" => $row, "sEcho" => $sEcho, "iTotalRecords" => sizeof($row), "iTotalDisplayRecords" => $cnt);
                }
            } catch (\PDOException $e) {
                return array("aaData" => [], "sEcho" => $sEcho, "iTotalRecords" => 0, "iTotalDisplayRecords" => 0, "isSuccess" => false, 'infos' => DataHandlerUtil::getUtf8FromGbk($e->getMessage()));
            }
        } else {
            return array("aaData" => [], "sEcho" => $sEcho, "iTotalRecords" => 0, "iTotalDisplayRecords" => 0, "info" => "userId is missing");
        }
    }

    public function getVideoOfTrash()
    {
        $sEcho = isset($_REQUEST["sEcho"])?$_REQUEST["sEcho"]:null;
        $sortColIndex = isset($_REQUEST["iSortCol_0"])?$_REQUEST["iSortCol_0"]:null;
        $sortType = isset($_REQUEST["sSortDir_0"])?$_REQUEST["sSortDir_0"]:null;
        $sortCol = isset($_REQUEST["mDataProp_" . $sortColIndex])?$_REQUEST["mDataProp_" . $sortColIndex]:null;
        $start = isset($_REQUEST["iDisplayStart"])?$_REQUEST["iDisplayStart"]:null;
        $length = isset($_REQUEST["iDisplayLength"])?$_REQUEST["iDisplayLength"]:null;
        if (isset($_REQUEST["token"])) {
            $token = $_REQUEST["token"];
            $jwtUtil = new JwtUtil();
            $jwt=$jwtUtil->parseJwt($token);
            
            $userId = $jwt->id;
            $infos = [];
            try {
                $sqliteUtil = new SqliteUtil();
                $db = $sqliteUtil->getDB();

                $ps = $db->prepare("select count(1) as cnt from videos where status=1 and userid=:userid");
                $ps->bindParam(":userid" , $userId);
                $rs=$ps->execute();
                if ($rs->numColumns() ) {
                    $cnt = $rs->fetchArray()["cnt"];
                    if ($cnt > 0) {
                        if ($start == "") {
                            $ps = $db->prepare("select * from videos where status=1 and userid=:userid order by week asc ");
                            $ps->bindParam(":userid" , $userId);
                            $rs=$ps->execute();
                        } else {
                            $ps = $db->prepare("select * from videos where status=1 and userid=:userid order by " . $sortCol . " " . $sortType . " LIMIT :start,:length ");
                            $ps->bindParam(":start" , $start);
                            $ps->bindParam( ":length", $length);
                            $ps->bindParam( ":userid" , $userId);
                            $rs=$ps->execute();
                        }
                        $row = array(); 
                        $i = 0; 
                        while($res = $rs->fetchArray(SQLITE3_ASSOC)){ 
                             $row[$i]=$res; 
                             $i++; 
                         } 
                    }
                    return array("aaData" => $row, "sEcho" => $sEcho, "iTotalRecords" => sizeof($row), "iTotalDisplayRecords" => $cnt);
                }
            } catch (\PDOException $e) {
                return array("aaData" => [], "sEcho" => $sEcho, "iTotalRecords" => 0, "iTotalDisplayRecords" => 0, "isSuccess" => false, 'infos' => DataHandlerUtil::getUtf8FromGbk($e->getMessage()));
            }
        } else {
            return array("aaData" => [], "sEcho" => $sEcho, "iTotalRecords" => 0, "iTotalDisplayRecords" => 0, "info" => "userId is missing");
        }
    }

    public function addNewVideo()
    {
        $title = $_REQUEST["title"];
        $link = $_REQUEST["link"];
        $image = $_REQUEST["image"];
        $time = $_REQUEST["time"];
        $token = $_REQUEST["token"];
        $jwtUtil = new JwtUtil();
        $jwt=$jwtUtil->parseJwt($token);
        
        $userId = $jwt->id;
        try {
            $sqliteUtil = new SqliteUtil();
            $db = $sqliteUtil->getDB();
            $id= UUIDUtil::uuid();
            $ps = $db->prepare("insert into videos (id,userid,link,img,title,week,status) values (:id,:userId,:link,:img,:title,:week,0)");
            $ps->bindParam(":id" ,$id);
            $ps->bindParam(":userId" , $userId);
            $ps->bindParam(":link" , $link);
            $ps->bindParam( ":img" , $image);
            $ps->bindParam( ":title" , $title);
            $ps->bindParam( ":week" , $time);
            $rs=$ps->execute();
            if ($rs) {
                return array("code"=>"00000");
            } else {
                return array("code"=>500,"info" => $ps->errorInfo());
            }
        } catch (\Exception $e) {
            return  array("code"=>500,"info" => $e->getMessage());
        }
    }

    public function editVideoById()
    {
        $id = $_REQUEST["id"];
        $title = $_REQUEST["title"];
        $link = $_REQUEST["link"];
        $image = $_REQUEST["image"];
        $time = $_REQUEST["time"];
        $token = $_REQUEST["token"];
        $jwtUtil = new JwtUtil();
        $jwt=$jwtUtil->parseJwt($token);
        
        $userId = $jwt->id;
        try {
            $sqliteUtil = new SqliteUtil();
            $db = $sqliteUtil->getDB();
            $ps = $db->prepare("update videos set link=:link,img=:img,title=:title,week=:week,updated_at=datetime('now') where userid=:userId and id=:id");
            $ps->bindParam(":userId" , $userId);
            $ps->bindParam(":link" , $link);
            $ps->bindParam( ":img" , $image);
            $ps->bindParam( ":title" , $title);
            $ps->bindParam( ":week" , $time);
            $ps->bindParam( ":id" , $id);
            $rs=$ps->execute();
            if ($rs) {
                return array("code"=>"00000");
            } else {
                return array("code"=>500,"info" => $ps->errorInfo());
            }
        } catch (\Exception $e) {
            return  array("code"=>500,"info" => $e->getMessage());
        }
    }

    public function fackDeleteById()
    {
        $id = $_REQUEST["id"];
        $token = $_REQUEST["token"];
        $jwtUtil = new JwtUtil();
        $jwt=$jwtUtil->parseJwt($token);
        
        $userId = $jwt->id;
        try {
            $sqliteUtil = new SqliteUtil();
            $db = $sqliteUtil->getDB();
            $ps = $db->prepare("update  videos set status =1 ,updated_at=datetime('now') where userid=:userId and id=:id");
            $ps->bindParam(":id" , $id);
            $ps->bindParam( ":userId" , $userId);
            $rs = $ps->execute();
            if ($rs) {
                return array("code"=>"00000");
            } else {
                return array("code"=>500,"info" => $ps->errorInfo());
            }
        } catch (\Exception $e) {
            return  array("code"=>500,"info" => $e->getMessage());
        }
    }

    public function deleteById()
    {
        $id = $_REQUEST["id"];
        $token = $_REQUEST["token"];
        $jwtUtil = new JwtUtil();
        $jwt=$jwtUtil->parseJwt($token);
        
        $userId = $jwt->id;
        try {
            $sqliteUtil = new SqliteUtil();
            $db = $sqliteUtil->getDB();
            $ps = $db->prepare("update  videos set status =2 ,updated_at=datetime('now') where userid=:userId and id=:id");
            $ps->bindParam(":id" , $id);
            $ps->bindParam( ":userId" , $userId);
            $rs = $ps->execute();
            if ($rs) {
                return array("code"=>"00000");
            } else {
                return array("code"=>500,"info" => $ps->errorInfo());
            }
        } catch (\Exception $e) {
            return  array("code"=>500,"info" => $e->getMessage());
        }
    }

    public function reductedById()
    {
        $id = $_REQUEST["id"];
        $token = $_REQUEST["token"];
        $jwtUtil = new JwtUtil();
        $jwt=$jwtUtil->parseJwt($token);
        
        $userId = $jwt->id;
        try {
            $sqliteUtil = new SqliteUtil();
            $db = $sqliteUtil->getDB();
            $ps = $db->prepare("update  videos set status =0 ,updated_at=datetime('now') where userid=:userId and id=:id");
            $ps->bindParam(":id" , $id);
            $ps->bindParam( ":userId" , $userId);
            $rs = $ps->execute();
            if ($rs) {
                return array("code"=>"00000");
            } else {
                return array("code"=>500,"info" => $ps->errorInfo());
            }
        } catch (\Exception $e) {
            return  array("code"=>500,"info" => $e->getMessage());
        }
    }

//     public function getImgUrlByName()
//     {
//         include_once(__DIR__. "/../utils/simple_html_dom.php");
//         $html = new \simple_html_dom();
//         $words = $_REQUEST["words"];
//         if ($words == "") {
//             return DataHandlerUtil::returnJson("-1", array("info" => "please fill the video's name"));
//         } else {
//             $html->load_file('http://v.baidu.com/v?ct=301989888&rn=20&pn=0&db=0&s=25&ie=utf-8&word=' . urlencode($words));
//             $imgs = $html->find(".search-block .special-base-wrap img");
//             $imgsall = $imgs;
// //            $html->load_file('http://m.v.baidu.com/search?src=video&word='.urlencode("�ְ�ȥ�Ķ�"));
// //            $imgs2=$html->find("#search-page>.search-bd>.search-block.search-block-tvshow>.special-base-wrap>.base-poster>img");
// //            $imgsall=array_merge($imgs,$imgs2);
//             $srcs = [];
//             foreach ($imgsall as $img) {
//                 $src = $img->src;
//                 if (
//                     strpos($src, "hiphotos.baidu") == false
//                     &&strpos($src, "qiyipic.com") == false
//                     &&strpos($src, "iqiyipic.com") == false
//                     ) {
//                     array_push($srcs, $src);
//                 }
//             }
//             $srcs=array_unique($srcs);
//             $set = array(); 
//             for($i=0;$i< max(array_keys($srcs));++$i){ 
//                 if(!empty($srcs[$i])){
//                     array_push($set, $srcs[$i]);
//                 }
//             }
//             return array("code"=>"00000","data" => $set);
//         }
//     }


    public function getImgUrlByName()   
    {
        $words = $_REQUEST["words"];
        $html = requests::get('http://m.v.baidu.com/search?word=' . urlencode($words));
        $data = selector::select($html, ".search-block .special-base-wrap img", "css");
        if(!isset($data)){
            $data=array();
        }
        if(is_string($data)){
            $set=array($data);
        }else{
            $set=$data;
        }
        return array("code"=>"00000","data" => $set);
    }

    public function getVideoByUser()
    {
        $infos = [];
        if (isset($_REQUEST["token"])) {
            $token = $_REQUEST["token"];
            $jwtUtil = new JwtUtil();
            $jwt=$jwtUtil->parseJwt($token);
            
            $userId = $jwt->id;
           
            try {
                $sqliteUtil=new SqliteUtil();
                $db=$sqliteUtil->getDB();
                $ps = $db->prepare("select count(1) as cnt from videos where status=0 and userid=:userid");
                $ps->bindParam(":userid" , $userId);
                $rs=$ps->execute();
                if ($rs->numColumns()) {
                    $cnt = $rs->fetchArray()["cnt"];
                    if ($cnt > 0) {
                        $ps = $db->prepare("select * from videos where status=0 and userid=:userid order by week asc");
                        $ps->bindParam(":userid" , $userId);
                        $rs=$ps->execute();
                        $row = array(); 
                        $i = 0; 
                        while($res = $rs->fetchArray(SQLITE3_ASSOC)){ 
                             $row[$i]=$res; 
                             $i++; 
                         } 
                    }
                    return array("info" => $infos,"success"=>true,"data"=>$row);
                }
            } catch (\PDOException $e) {
                array_push($infos, $e->errorInfo);
                return array("info" => $infos,"success"=>false);
            }
        } else {
            array_push($infos, "token is missing");
            return array("info" => $infos,"success"=>false);
        }
    }
}