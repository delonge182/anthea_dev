/*
 *
 *
 *
 * (C) COPYRIGHT Talian Limited, 2010
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets.
 *
 */
package com.talian.beans.flightsession;

import java.rmi.RemoteException;
import java.util.List;

import psdi.mbo.MboRemote;
import psdi.mbo.MboSetRemote;
import psdi.util.MXException;
import psdi.util.MXSession;
import psdi.webclient.system.beans.AppBean;
import psdi.webclient.system.controller.RequestHandler;

import com.talian.app.assignment.RouteAssignment;
import com.talian.app.heli.Fleet;
import com.talian.app.heli.HeliServiceRemote;
import com.talian.app.route.Port;
import com.talian.app.scenario.Configuration;
import com.talian.app.scenario.FlightScenario;

/**
 * @author Elga
 *
 */
public class FlightsessionAppBean extends AppBean {
	
	public FlightsessionAppBean() throws RemoteException, MXException {
	}

	public void FINDNBEST() throws MXException, RemoteException { 
		RequestHandler.showDialog(sessionContext, "auto_calculating");
		
		MXSession mxsession = this.getMXSession();
		HeliServiceRemote svcHeli = (HeliServiceRemote)mxsession.lookup("HELI");
		
		FlightScenario flightscenario = FlightScenario.newRecord(mxsession, this.getMbo().getDate("reserveddate"), this.getMbo().getString("flightsession"));
		
		// ### scenconfig
		MboSetRemote configs = this.getMbo().getMboSet("defaultscenconfig9", "SCENCONFIG") ;
		configs.setWhere("scenarioid is null") ;
		MboRemote cfg = configs.moveFirst() ;
		flightscenario.setConfig(Configuration.readfromMBO(cfg));
		
		// ### availfleets
		MboSetRemote availacregset = this.getMbo().getMboSet("availableacreg9", "ACREG");
		availacregset.setWhere("status = 'ACTIVE'");
		availacregset.moveFirst();
		MboRemote availacreg = availacregset.moveFirst();
		while (availacreg != null) {
			Fleet flt = Fleet.readfromMBO(flightscenario,availacreg) ;
			flightscenario.setFleetAvailability(availacreg.getString("acreg"), flt, availacreg.getString("status").equals("ACTIVE"));
			availacreg = availacregset.moveNext();
		}
		
		// ### availports		
		MboSetRemote ports = this.getMbo().getMboSet("availableports9", "HELIPORT") ;
		ports.setWhere(" portstatus in ('ACTIVE', 'OPEN') and ishelipad = 1 ");
		MboRemote prt = ports.moveFirst() ;
		while (prt != null) {
			Port heliport = Port.readfromMBO(flightscenario,prt);
			flightscenario.availablePorts.put(heliport.getPort(), heliport);
			if (heliport.hasRefuelingCapability())
				flightscenario.refuelingPorts.put(heliport.getPort(), heliport);
			prt  = ports.moveNext();
		}
		
		svcHeli.setSchedullerRunning(true);
		RouteAssignment ra = new RouteAssignment(flightscenario, svcHeli);
		List<FlightScenario> fsList2 = null;
    	List<FlightScenario> fsList = ra.findNBest(5, 1*60*1000, false, fsList2);
    	
    	if (fsList != null) {
    		int nCount = fsList.size();
    		for (int i=0; i<nCount; i++) {
    			FlightScenario scen = fsList.get(i);
    			System.out.println(scen);
    			scen.save();
    			scen.getMbo().getThisMboSet().save();
    		}
    	}
    	else {
    		System.out.println("Scenario is not found"); 
    	}
	}
	
	@Override
	public int SAVE() throws MXException, RemoteException {
		return super.SAVE();
	}
}
