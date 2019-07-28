<?php
function readLines($fp) {
	while(!feof($fp)) yield trim(fgets($fp));
	fclose($fp);
}

if(!empty($_POST['file_0_infos'])) {
	$infos = json_decode($_POST['file_0_infos']);

	// If compressed
	if($infos->compressed) {
		// Décompresse et sauvegarde le fichier uploadé
		$upFile = fopen('uploadfile', 'w+');
		$gzFile = gzopen($_FILES['file_0']['tmp_name'], 'r');
		stream_copy_to_stream($gzFile, $upFile);
		gzclose($gzFile);

		// Remet le pointeur au début du fichier
		fseek($upFile, 0);
	} else {
		// Sauvegarde la fichier uploadé
		move_uploaded_file($_FILES['file_0']['tmp_name'], 'uploadfile');
		// Ouvre le fichier uploadé
		$upFile = fopen('uploadfile', 'r+');
	}

	// Process the file
	require_once 'nv3.php';
	$nv3 = new nv3();
	$nv3->import(readLines($upFile));	
}

header('Content-Type: application/json');
echo json_encode(['success' => true/*, '$_FILES' => $_FILES ?? [], '$_POST' => $_POST ?? []*/]);