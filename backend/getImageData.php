<?php
if(isset($_POST)) {
    $idProcessingResult = $_POST['idProcessingResult'];
    try {
        require('connection.php');
        $query = $conn->prepare("SELECT * FROM imageCollection WHERE idProcessingResult = :idProcess LIMIT 1");
        $query->bindParam(":idProcess", $idProcessingResult);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;
        echo json_encode($result);
    } catch (mysqli_sql_exception $e) {
        echo $e;
    }
}
?>