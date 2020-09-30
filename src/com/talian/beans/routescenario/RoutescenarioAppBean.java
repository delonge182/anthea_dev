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
package com.talian.beans.routescenario;

import java.rmi.RemoteException;
import java.util.Date;
import java.util.Vector;

import psdi.mbo.MboRemote;
import psdi.mbo.MboSetRemote;
import psdi.util.MXException;
import psdi.webclient.system.beans.AppBean;

import com.talian.app.heli.Fleet;
import com.talian.app.reservation.Reservation;
import com.talian.app.reservation.ReservationRemote;
import com.talian.app.route.Route;
import com.talian.app.routescenario.Routescenario;
import com.talian.app.scenario.FlightScenario;

/**
 * @author Elga
 *
 */
public class RoutescenarioAppBean extends AppBean {

	/**
	 *
	 */
	public RoutescenarioAppBean() {
	}

	public void ADDSCEN(Date reservedate, String session) throws MXException, RemoteException {
		MboSetRemote mboset = this.getMboSet();
		MboRemote mbo =  mboset.add();
	}
	
	public void REGTOFL() throws RemoteException, MXException{
		Routescenario routescenario = (Routescenario) this.getMbo();
		FlightScenario flightscenario = FlightScenario.readfromMBO(routescenario);
		
		MboSetRemote reservationset = routescenario.getMboSet("RESERVATION2");
		MboSetRemote availfleetset = routescenario.getMboSet("AVAILFLEETS");
		MboRemote availfleets = availfleetset.moveFirst();
		
		Vector <ReservationRemote>vreservation = reservationset.getSelection();
		Vector <MboRemote>vfleet = availfleetset.getSelection();
		MboRemote selectedfleet = vfleet.get(0);
		Route route = routescenario.getCurrentRoutes().get(selectedfleet.getString("ACREG"));
		Fleet fleet = flightscenario.getFleet(vfleet.get(0).getString("ACREG"));
		for (int i = 0; i < vreservation.size(); i++) {
			ReservationRemote selectedresv = Reservation.readfromMBO((Reservation) vreservation.get(i));
			if (route != null) {
				route.addPortAtEnd(selectedresv);
			} else {
				Route newroute = fleet.getRoute();
				newroute.addPortAtEnd(selectedresv);
			}
		}
		if (route != null) {
			fleet.replaceRoute(route);	
		}
		flightscenario.save();		
		SAVE();
	}
}
