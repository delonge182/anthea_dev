<html>
	<head>
		<link rel="stylesheet" type="text/css" href="../resources/css/ext-all.css">
		<link rel="stylesheet" type="text/css" href="../css/coco.css">
		<link rel="stylesheet" type="text/css" href="../css/gmap.css">

		<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=ABQIAAAAA5hFP8FaUqHcTS_vAEmmZxS_OEsLd2UuIKmISfuOQTZsJNEXJBRjI6c5aZUyxwiAKLteeRZojM30oA" type="text/javascript"></script>
		<script type="text/javascript" src="../adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="../ext-all-debug.js"></script>
		<script type="text/javascript" src="../../djn/djn-remote-call-support.js"></script>
        <script type="text/javascript" src="../../ejn/ejn-assert.js"></script>
        <script type="text/javascript" src="../common/api-debug.js"></script>
		<script type="text/javascript" src="../app/gmapm.js"></script>
	</head>

<body>

<div id='map_canvas'   style='padding: 0px 3px 0px 0px; position:absolute; top:0px; left:0px;     width: 500px;             height: 550px; z-index:1000'></div>
<div id='data1_canvas' style='padding: 0px 3px 0px 0px; position:absolute; top:0px; left:400px; display:block; height: 780px;'></div>
<div id='data2_canvas' style='padding: 0px 3px 0px 0px; position:absolute; top:0px; left:800px; display:block; height: 780px;'></div>
<div id='scenarios' class='x-hidden' style='top:150px;position:absolute;'>
    <div class='x-window-header'>Scenarios</div>
    <div id='hello-tabs'>
        <div class='x-tab' title='001 - 3 fleets (262)'>
            <p>3 Fleets, total cost : 262.44 minutes</p>
            <p><table> <tbody>
            	<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPE</b></td><td style='border:0px;font-size:11px'>SPG-NPU-GJD-SPU-CPU-SNP-RAN-SPG</td></tr>
            	<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPF</b></td><td style='border:0px;font-size:11px'>SPG-HDL-SOE-SPG</td></tr>
            	<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPG</b></td><td style='border:0px;font-size:11px'>SPG-SPU-SPG</td></tr>
            	<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPD</b></td><td style='border:0px;font-size:11px'>(no flight)</td></tr>
            </tbody>
            </table></p>
        </div>
        <div class='x-tab' title='002 - 3 fleets (269)'>
            <p>3 Fleets, total cost : 202.87 minutes</p>
            <p><table> <tbody>
            	<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPE</b></td><td style='border:0px;font-size:11px'>SPG-RAN-SOE-SPU-NPU-GJD-HDL-SNP-SPG</td></tr>
            	<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPF</b></td><td style='border:0px;font-size:11px'>SPG-CPU-SPG</td></tr>
            	<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPG</b></td><td style='border:0px;font-size:11px'>SPG-SPU-SPG</td></tr>
            	<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPD</b></td><td style='border:0px;font-size:11px'>(no flight)</td></tr>
            </tbody>
            </table></p>
        </div>
    </div>
    <div id="scenariovw">
    </div>
</div>
<div id='data3_canvas' style='padding: 0px 3px 0px 0px; position:absolute; top:0px; left:400px; display:block; height: 500px;'></div>
</body>
</html>