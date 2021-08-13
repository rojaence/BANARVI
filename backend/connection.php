<?php
    $server = "mysql:dbname=banarvidb;host=localhost";
    $user = "root";
    $password = "";
    try {
        $conn = new PDO($server, $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    } catch (PDOException $e){
        echo "Failed connection" .$e->getMessage();
    }
?>