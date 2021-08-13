<?php
    if(isset($_POST)) {
        $dateData = $_POST['date'];
        $widthRectImg1 = $_POST['widthRectImg1'];
        $heightRectImg1 = $_POST['heightRectImg1'];
        $areaImg1 = $_POST['areaImg1'];
        $perimeterImg1 = $_POST['perimeterImg1']; 
        $yellowImg1 = $_POST['yellowImg1'];
        $greenImg1 = $_POST['greenImg1'];
        $widthRectImg2 = $_POST['widthRectImg2'];
        $heightRectImg2 = $_POST['heightRectImg2'];
        $areaImg2 = $_POST['areaImg2'];
        $perimeterImg2 = $_POST['perimeterImg2']; 
        $yellowImg2 = $_POST['yellowImg2'];
        $greenImg2 = $_POST['greenImg2'];
        try {
            require("connection.php");
            $query = $conn->prepare("INSERT INTO processingresult (dateData, widthRectImg1, heightRectImg1, areaImg1, perimeterImg1, yellowImg1, greenImg1, widthRectImg2, heightRectImg2, areaImg2, perimeterImg2, yellowImg2, greenImg2) VALUES (:dat, :wRect1, :hRect1, :aImg1, :pImg1, :yImg1, :gImg1, :wRect2, :hRect2, :aImg2, :pImg2, :yImg2, :gImg2 )");
            $query->bindParam(":dat", $dateData);
            $query->bindParam(":wRect1", $widthRectImg1);
            $query->bindParam(":hRect1", $heightRectImg1);
            $query->bindParam(":aImg1", $areaImg1);
            $query->bindParam(":pImg1", $perimeterImg1);
            $query->bindParam(":yImg1", $yellowImg1);
            $query->bindParam(":gImg1", $greenImg1);
            $query->bindParam(":wRect2", $widthRectImg2);
            $query->bindParam(":hRect2", $heightRectImg2);
            $query->bindParam(":aImg2", $areaImg2);
            $query->bindParam(":pImg2", $perimeterImg2);
            $query->bindParam(":yImg2", $yellowImg2);
            $query->bindParam(":gImg2", $greenImg2);
            $query->execute();
            $conn = null;
            require("connection.php");
            $query = $conn->prepare("SELECT * FROM processingresult ORDER BY idProcessingResult DESC LIMIT 1");
            $query->execute();
            $result = $query->fetchAll(PDO::FETCH_ASSOC);
            foreach ($result as $data) {
                echo (int)$data['idProcessingResult'];
            }
        } catch (mysqli_sql_exception $e) {
            echo $e;
        }
    }
?>