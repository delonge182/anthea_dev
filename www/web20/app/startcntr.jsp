<%@ page contentType="application/x-javascript" import="psdi.webclient.system.beans.*, psdi.webclient.system.controller.*, java.util.*, psdi.bo.*, psdi.util.*, java.io.*" %>
<%
	SessionContext sessionContext = SessionContext.getSessionContext(request);
	psdi.util.MXSession s = psdi.webclient.system.controller.RequestHandler.getMXSession(session);
	if (! s.isConnected())
	{
		%>
			alert("Not connected") ;
		<%
		return;
	}
	String app = (String)request.getParameter("app") ;
	String scid = (String)request.getParameter("scid") ;
	String web20Path = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+request.getContextPath()+"/web20";
	String webClientPath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+request.getContextPath()+"/webclient";
%>

var run_launcher = function () {
	var body = Ext.get("_placeholder");
	body.createChild("<div id='map_canvas' style='padding: 0px 3px 0px 0px;position: absolute; top: 0px; left:0; width: 370px; height: 790px; z-index:1000'></div>");
	body.createChild("<div id='data1_canvas' style='padding: 0px 3px 0px 0px; position:absolute; top: 0px; left:373px; display:block; height: 800px;'></div>");
	body.createChild("<div id='data2_canvas' style='padding: 0px 3px 0px 0px; position:absolute; top: 0px; left:726px; display:block; height: 800px;'></div>");
	body.createChild("<div id='scenarios' class='x-hidden' style='top:150px;position:absolute;'>"+
    "<div class='x-window-header'>Scenarios</div>"+
		"<div id='hello-tabs'>"+
			"<div class='x-tab' title='001 - 3 fleets (262)'>"+
				"<p>3 Fleets, total cost : 262.44 minutes</p>"+
				"<p><table> <tbody>"+
					"<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPE</b></td><td style='border:0px;font-size:11px'>SPG-NPU-GJD-SPU-CPU-SNP-RAN-SPG</td></tr>"+
					"<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPF</b></td><td style='border:0px;font-size:11px'>SPG-HDL-SOE-SPG</td></tr>"+
					"<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPG</b></td><td style='border:0px;font-size:11px'>SPG-SPU-SPG</td></tr>"+
					"<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPD</b></td><td style='border:0px;font-size:11px'>(no flight)</td></tr>"+
				"</tbody>"+
				"</table></p>"+
			"</div>"+
			"<div class='x-tab' title='002 - 3 fleets (269)'>"+
				"<p>3 Fleets, total cost : 202.87 minutes</p>"+
				"<p><table> <tbody>"+
					"<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPE</b></td><td style='border:0px;font-size:11px'>SPG-RAN-SOE-SPU-NPU-GJD-HDL-SNP-SPG</td></tr>"+
					"<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPF</b></td><td style='border:0px;font-size:11px'>SPG-CPU-SPG</td></tr>"+
					"<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPG</b></td><td style='border:0px;font-size:11px'>SPG-SPU-SPG</td></tr>"+
					"<tr><td style='border:0px;font-size:11px;width=100px'><b>PK-TPD</b></td><td style='border:0px;font-size:11px'>(no flight)</td></tr>"+
				"</tbody>"+
				"</table></p>"+
			"</div>"+
		"</div>"+
	"</div>");

	body.createChild("<div id='scenlogs' class='x-hidden' style='top:150px;position:absolute;'>"+
    "<div class='x-window-header'>Automatic Scheduling</div>"+
		"<div id='scenlogdiv'>"+
			"<div class='x-panel' title='Log'>"+
				"<div id='scenlogdiventry' style='overflow:scroll; height:200px'> </div>"+
			"</div>"+
		"</div>"+
	"</div>");

	loadjscssfile('<%=web20Path%>/css/gmap.css', 'css') ;
	loadjscssfile('<%=web20Path%>/examples/shared/examples.css', 'css') ;
	//waitingGmap() ;
	if(typeof(GMap2) != 'undefined' || typeof(GOverlay) != 'undefined'){
		loadjscssfile('<%=web20Path%>/app/gmap.js', 'js') ;
	} else {
		loadjscssfile('<%=web20Path%>/app/nongmap.js', 'js') ;
	}
}


function waitingGmap(){
	if(typeof(GMap2) == 'undefined' || typeof(GOverlay) == 'undefined'){
    	//defer(1000, this);
    	setInterval('waitingGmap()', 0);
    }
}
