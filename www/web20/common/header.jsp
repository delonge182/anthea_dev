<%--
 *
 * Talian Confidential
 *
 * (C) COPYRIGHT Talian, 2011
 *
--%>
<%@ page contentType="application/x-javascript" import="com.talian.beans.common.*, psdi.webclient.system.beans.*, psdi.webclient.system.controller.*, java.util.*, psdi.bo.*, psdi.util.*, java.io.*" %>
<%
	SessionContext sessionContext = SessionContext.getSessionContext(request);
	psdi.util.MXSession s = psdi.webclient.system.controller.RequestHandler.getMXSession(session);
	if (! s.isConnected())
	{	
		%>
			alert("Not connected....") ;
		<%
		return;
	}
	String app = (String)request.getParameter("app") ;
	String scid = (String)request.getParameter("sc") ;
	String web20Path = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+request.getContextPath()+"/web20";
	String webClientPath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+request.getContextPath()+"/webclient";	
%>