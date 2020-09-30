<%@ include file="../common/header.jsp" %>
var run_launcher = function () {
    var dom1 = Ext.get('_placeholder').dom ;
    dom1.innerHTML = dom1.innerHTML + '<BR/>' + 'Fleet Position Query =  <%=request.getQueryString()%>  app = <%=app%>' ; 
} 