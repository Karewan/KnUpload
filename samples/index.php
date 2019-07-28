<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>test up</title>
	<style type="text/css">
	html, body {
		font-family: sans-serif;
		margin: 0;
	}
	#zone {
		width: 500px;
		height: 300px;
		margin: 10vh auto;
		border: 2px solid #ddd;
		position: relative;
	}
	#txtStatus {
		text-align: center;
		line-height: 300px;
	}
	#zone label {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		color: transparent;
		cursor: pointer;
	}
	#zone input {
		outline: 0;
		width: 0;
		height: 0;
		color: transparent;
		font-size: 0;
		background: 0 0;
		padding: 0;
		margin: 0;
		visibility: hidden;
	}
	</style>
</head>
<body>
	<div id="zone">
		<div id="txtStatus"></div>
		<label><input type="file" multiple></label>
	</div>

	<script src="js/jquery-3.4.1.min.js"></script>
	<script src="js/kupload-1.0.0.min.js"></script>
	<script type="text/javascript">
	var txtStatus = $('#txtStatus');
	var zone = $('#zone');

	zone.kupload({
		url: 'http://localhost/testup/upload.php',
		multiple: true,
		compress: true,
		pakoDeflatePath: 'http://localhost/testup/js/pako_deflate-1.0.10.min.js',
		timeout: 0,
		maxfilesize: 20971520,
		maxfiles: 3,
		resDataType: 'json',
		onDragEnter: function() {
			console.log('onDragEnter');
			zone.css('border-color', '#F44336');
		},
		onDragLeave: function() {
			console.log('onDragLeave');
			zone.css('border-color', '#DDD');
		},
		onNewFiles: function(files) {
			console.log('onNewFiles files=', files);
		},
		onFileSizeError: function() {
			console.log('onFileSizeError');
			txtStatus.html("20 Mo maximum");
		},
		onTooManyFiles: function() {
			console.log('onTooManyFiles');
			txtStatus.html("3 fichiers maximum");
		},
		onBeforeUpload: function() {
			console.log('onBeforeUpload');
			txtStatus.html("Préparation de l'envoi du fichier");
		},
		onUploadProgress: function(progress) {
			console.log('onUploadProgress progress=', progress);
			txtStatus.html("Envoi en cours... " + progress + "%");
		},
		onUploadComplete: function() {
			console.log('onUploadComplete');
			txtStatus.html("Fichier en cours de traitement par le serveur...");
		},
		onUploadSuccess: function(res) {
			console.log('onUploadSuccess res=', res);
			txtStatus.html('Fichier importé avec succès !');
		},
		onUploadError: function(error) {
			console.log('onUploadError error=', error);
			txtStatus.html("Une erreur est survenue lors de l'envoi du fichier");
		},
		onAjaxComplete: function() {
			console.log('onAjaxComplete');
		}
	});
	</script>
</body>
</html>