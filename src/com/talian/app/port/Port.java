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
package com.talian.app.port;

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;
import psdi.util.MXException;

import com.ibm.tivoli.maximo.srvad.app.ServiceAddressRemote;

/**
 * @author Elga
 *
 */
public class Port extends Mbo implements PortRemote {

	/**
	 * @param ms
	 * @throws RemoteException
	 */
	public Port(MboSet ms) throws RemoteException {
		super(ms);
	}

	@Override
	public ServiceAddressRemote getServiceAddress() throws MXException, RemoteException
	{
	    ServiceAddressRemote mbo = (ServiceAddressRemote)getMboSet("SERVICEADDRESS").getMbo(0);
	    return mbo;
	}

	@Override
	public boolean hasServiceAddress() throws MXException, RemoteException
	{
	    return !isNull("SACODE");
	}
	
	@Override
	public String getAddressString() throws MXException, RemoteException {
	    ServiceAddressRemote srvad = getServiceAddress();
	    if (srvad != null)
	    {
	        return srvad.getAddressString();
	    }
	    else
	    {
	        return null;
	    }
	}

	@Override
	public Double getLatitudeY() throws MXException, RemoteException {
	    ServiceAddressRemote srvad = getServiceAddress();
	    if (srvad != null)
	    {
	        return srvad.getLatitudeY();
	    }
	    else
	    {
	        return null;
	    }
	}

	@Override
	public Double getLongitudeX() throws MXException, RemoteException {
	    ServiceAddressRemote srvad = getServiceAddress();
	    if (srvad != null)
	    {
	        return srvad.getLongitudeX();
	    }
	    else
	    {
	        return null;
	    }
	}

	@Override
	public Boolean hasCoords() throws MXException, RemoteException {
	    if (hasServiceAddress())
	    {
	        ServiceAddressRemote mbo = getServiceAddress();
	        if (mbo != null)
	        {
	            return mbo.hasCoords();
	        }
	    }
	    return false;
	}
	
	@Override
	public boolean isGISDataReadonly() throws MXException, RemoteException
	{
	    return true;
	}

	@Override
	public void saveGISData(String address, String lat, String lng)
	        throws MXException, RemoteException
	{
	}
}
