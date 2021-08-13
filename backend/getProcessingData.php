<?php
    if(isset($_POST)) {
    $typeQuery = $_POST['typeQuery'];
    // Definir más campos para validar consultas
    if ($typeQuery == "All") {
        try {
            $arrayData = array();
            require("connection.php");
            $query = $conn->prepare("SELECT processingResult.idProcessingResult, dateData, widthRectImg1, heightRectImg1, areaImg1, perimeterImg1, yellowImg1, greenImg1, widthRectImg2, heightRectImg2, areaImg2, perimeterImg2, yellowImg2, greenImg2, originImg1, contourImg1, colourImg1, originImg2, contourImg2, colourImg2  FROM processingResult, imageCollection WHERE processingResult.idProcessingResult = imageCollection.idProcessingResult ORDER BY dateData");
            $query->execute();
            $result = $query->fetchAll(PDO::FETCH_ASSOC);
            $conn = null;
            echo json_encode($result);
        }
        catch (mysqli_sql_exception $e) {
            echo $e;
        }
    }
}
?>