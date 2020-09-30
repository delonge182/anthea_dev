package com.talian.beans.flightsession;

import java.rmi.RemoteException;

import psdi.app.configure.ConfigureServiceRemote;
import psdi.server.MXServer;
import psdi.util.MXException;
import psdi.util.MXSession;
import psdi.webclient.system.beans.DataBean;
import psdi.webclient.system.controller.Utility;

import com.talian.app.heli.HeliServiceRemote;

public class RunAutoCalcDataBean extends DataBean {
	private HeliServiceRemote svcHeli;
	
    public RunAutoCalcDataBean()
    {
    	svcHeli = null;
//		configAlreadyStarted = false;
    }
    
    @Override
    protected void initialize() throws MXException, RemoteException {
    	super.initialize();
    	svcHeli = (HeliServiceRemote)MXServer.getMXServer().lookup("HELI");
		if(app.getCurrentPageId().equals("auto_calculating")) {
			refreshStatus();
	    }
    }
    
    public int refreshStatus() throws MXException, RemoteException {
    	if(svcHeli == null)
    		svcHeli = (HeliServiceRemote)MXServer.getMXServer().lookup("HELI");
    	if(!svcHeli.isSchedullerRunning())
    	    Utility.showMessageBox(sessionContext.getCurrentEvent(), "configure", "ConfigdbDone", null);
    	getMbo().getString("status");
    	fireDataChangedEvent();
    	sessionContext.queueRefreshEvent();
    	return 1;
    }
    
    
}
