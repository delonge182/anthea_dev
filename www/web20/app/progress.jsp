<%@ page contentType="text/html;charset=UTF-8" import= "com.talian.web20.system.controller.*, psdi.webclient.system.controller.*, java.util.*, psdi.bo.*, psdi.util.*, psdi.security.*, java.io.*" %>
<%
	String web20Path = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+request.getContextPath()+"/web20";
	String imagesPath = web20Path + "/images" ;
	
	SessionContext sessionContext = SessionContext.getSessionContext(request);
	request.setCharacterEncoding("UTF-8");
	String scid = sessionContext.getSessionContextID() ;
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<meta HTTP-EQUIV="content-type" CONTENT="text/html; charset=UTF-8">
		
		<script type="text/javascript" src="<%=web20Path%>/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="<%=web20Path%>/ext-all-debug.js"></script>
		<script type="text/javascript" src="<%=web20Path%>/common/api.js"></script>
		
		<script language="javascript" src="progress.js"></script>
		
		<link rel="stylesheet" type="text/css" href="<%=web20Path%>/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="<%=web20Path%>/resources/css/xtheme-gray.css"/>

	    <style type="text/css"> #out { padding: 5px; overflow:auto; border-width:0; } #out b { color:#555; } #out xmp { margin: 5px; } #out p { margin:0; } </style>
		
	
	</head>
<body>
	<div  >
	</div>
	
	Testing		
</body>  