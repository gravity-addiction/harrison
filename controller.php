<?php
$ajax_version = filesize('data/version');
$version_dir = sprintf("data/%d/",$ajax_version);

if ($_REQUEST['direction']=='VERSION') {
  echo $ajax_version;
  exit();
}


if ($_REQUEST['direction']=='SAVE') {
    // NEED TO DO THIS SOMETIME
    //touch('data/savelock');
    
    
    
    
    // Newer Server Version
    if ($_REQUEST['version']!=$ajax_version && (!isset($_REQUEST['doAnyway']) || empty($_REQUEST['doAnyway']))) {
      header("Content-type: text/xml");
      echo('<?xml version="1.0"?>');
      echo('<xml>');
      echo('<status>Failure</status>');
      echo('<reason>Unable to Save, Server has more current version, refresh data and remake changes</reason>');
      echo('<version>'.($ajax_version+1).'</version>');
      echo('</xml>');
      exit();
    }
    
    // Append Version Number
    file_put_contents('data/version','.',FILE_APPEND);
    $ajax_version = filesize('data/version');
    $version_dir = sprintf("data/%d/",$ajax_version);
    
    // Create Version Directory
    if (!mkdir($version_dir)) {
      header("Content-type: text/xml");
      echo('<?xml version="1.0"?>');
      echo('<xml>');
      echo('<status>Failure</status>');
      echo('<reason>Unable to create version directory</reason>');
      echo('<version>'.($ajax_version+1).'</version>');
      echo('</xml>');
      exit();
    }
    
    file_put_contents($version_dir.'jumperlist.json',$_REQUEST['jumperlist_html']);
    file_put_contents($version_dir.'jumperdb.json',$_REQUEST['jumperdb_html']);
    file_put_contents($version_dir.'manifest_html.json',$_REQUEST['manifest_html']);
    file_put_contents($version_dir.'messagelist_html.json',$_REQUEST['messagelist_html']);

    
    header("Content-type: text/xml");
    echo('<?xml version="1.0"?>');
    echo('<xml>');
    echo('<status>Success</status>');
    echo("<version>$ajax_version</version>");
    echo('</xml>');
    exit();
}




if ($_REQUEST['direction']=='GET') {
  
  header("Content-type: text/xml");
  echo('<?xml version="1.0"?>');
  echo('<xml>');
  echo("<version>$ajax_version</version>");
  echo('<jumperlist_html><![CDATA['.file_get_contents($version_dir.'jumperlist.json').']]></jumperlist_html>');
  echo('<jumperdb_html><![CDATA['.file_get_contents($version_dir.'jumperdb.json').']]></jumperdb_html>');
  echo('<manifest_html><![CDATA['.file_get_contents($version_dir.'manifest_html.json').']]></manifest_html>');
  echo('<messagelist_html><![CDATA['.file_get_contents($version_dir.'messagelist_html.json').']]></messagelist_html>');
  
  echo('</xml>');
}

?>