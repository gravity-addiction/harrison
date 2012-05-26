<%@ page language="C#" debug="true" validateRequest=false %>
<%@ import Namespace="System.IO" %>
<%@ Import Namespace="System.Xml" %>
<%
    
    bool createNewFiles = true;
    string dataPath = "D:\\DMZ_WWWROOT_DEVEL\\data\\";

    string versionFile = @dataPath + "version";
    FileInfo versionInfo = new FileInfo(versionFile);

    //Response.Write(versionInfo.Length);
    
    string versionDir = String.Format("{0}\\{1}",dataPath,versionInfo.Length.ToString());

    if (Request["direction"] == "VERSION")
    {
        Response.Write(versionInfo.Length.ToString());
        Response.End();
    }


    Byte[] jumperList_html = new UTF8Encoding(true).GetBytes("");
    Byte[] jumperDB_html = new UTF8Encoding(true).GetBytes("");
    Byte[] manifest_html = new UTF8Encoding(true).GetBytes("");
    Byte[] messagelist_html = new UTF8Encoding(true).GetBytes("");
    
    XmlDocument xmlDoc = new XmlDocument();
    XmlDeclaration xmlDec = xmlDoc.CreateXmlDeclaration("1.0", null, null);
    XmlElement xmlEle = xmlDoc.CreateElement("xml");
    XmlNode xmlNode;
    XmlAttribute xmlAttr;
    XmlCDataSection xmlCData;
    xmlDoc.AppendChild(xmlDec);
    xmlDoc.AppendChild(xmlEle);
    
    
    if (Request["direction"] == "SAVE")
    {
        if (Request["version"] != versionInfo.Length.ToString() && String.IsNullOrEmpty(Request["doAnyway"]))
        {
            xmlNode = xmlDoc.CreateNode(XmlNodeType.Element, "status", "");
            
            xmlAttr = xmlDoc.CreateAttribute("reason"); // Create interest Attribute
            xmlAttr.Value = "Unable to Save, Server has more current version, refresh data and remake changes";
            xmlNode.Attributes.Append(xmlAttr);
            
            xmlNode.InnerText = "Failure";
            
            xmlEle.AppendChild(xmlNode);

            Response.ContentType = "text/xml";
            Response.Write(xmlDoc.OuterXml);
            Response.End();
        }
        
        
        // Add another period to the verison file
        if (createNewFiles == true)
        {
            using (StreamWriter sw = File.AppendText(versionFile))
            {
                sw.Write(".");
            }
            versionInfo = new FileInfo(versionFile);
            versionDir = String.Format("{0}\\{1}", dataPath, versionInfo.Length.ToString());
        }
        
        // Create Version Directory
        try
        {
            // Determine whether the directory exists.
            if (!Directory.Exists(versionDir))
            {
                // Try to create the directory.
                DirectoryInfo di = Directory.CreateDirectory(versionDir);
            }
        }
        catch (Exception e)
        {
            Response.Write(String.Format("The process failed: {0}", e.ToString()));
            Response.End();
        }



        try
        {
            jumperList_html = new UTF8Encoding(true).GetBytes(Request["jumperlist_html"]);
        }
        catch { }
        finally
        {
            using (FileStream fs = File.Create(versionDir + "\\jumperlist.json"))
            {
                fs.Write(jumperList_html, 0, jumperList_html.Length);
            }
        }
        
        try
        {
            jumperDB_html = new UTF8Encoding(true).GetBytes(Request["jumperdb_html"]);
        }
        catch { }
        finally
        {
            using (FileStream fs = File.Create(versionDir + "\\jumperdb.json"))
            {
                fs.Write(jumperDB_html, 0, jumperDB_html.Length);
            }
        }

        try
        {
            manifest_html = new UTF8Encoding(true).GetBytes(Request["manifest_html"]);
        }
        catch { }
        finally
        {
            using (FileStream fs = File.Create(versionDir + "\\manifest_html.json"))
            {
                fs.Write(manifest_html, 0, manifest_html.Length);
            }
        }

        try
        {
            messagelist_html = new UTF8Encoding(true).GetBytes(Request["messagelist_html"]);
        }
        catch { }
        finally
        {
            using (FileStream fs = File.Create(versionDir + "\\messagelist_html.json"))
            {
                fs.Write(messagelist_html, 0, messagelist_html.Length);
            }
        }

        xmlNode = xmlDoc.CreateNode(XmlNodeType.Element, "status", "");
        xmlNode.InnerText = "Success";
        xmlEle.AppendChild(xmlNode);
        
        xmlNode = xmlDoc.CreateNode(XmlNodeType.Element, "version", "");
        xmlNode.InnerText = versionInfo.Length.ToString();
        xmlEle.AppendChild(xmlNode);

        Response.ContentType = "text/xml";
        Response.Write(xmlDoc.OuterXml);
        Response.End();
        
    }

    if (Request["Direction"] == "GET")
    {


        jumperList_html = File.ReadAllBytes(versionDir + "\\jumperlist.json");
        jumperDB_html = File.ReadAllBytes(versionDir + "\\jumperdb.json");
        manifest_html = File.ReadAllBytes(versionDir + "\\manifest_html.json");
        messagelist_html = File.ReadAllBytes(versionDir + "\\messagelist_html.json");

        xmlNode = xmlDoc.CreateNode(XmlNodeType.Element, "version", "");
        xmlNode.InnerText = versionInfo.Length.ToString();
        xmlEle.AppendChild(xmlNode);

        xmlNode = xmlDoc.CreateNode(XmlNodeType.Element, "jumperlist_html", "");
        xmlCData = xmlDoc.CreateCDataSection(System.Text.Encoding.UTF8.GetString(jumperList_html));
        xmlNode.AppendChild(xmlCData);
        xmlEle.AppendChild(xmlNode);

        xmlNode = xmlDoc.CreateNode(XmlNodeType.Element, "jumperdb_html", "");
        xmlCData = xmlDoc.CreateCDataSection(System.Text.Encoding.UTF8.GetString(jumperDB_html));
        xmlNode.AppendChild(xmlCData);
        xmlEle.AppendChild(xmlNode);

        xmlNode = xmlDoc.CreateNode(XmlNodeType.Element, "manifest_html", "");
        xmlCData = xmlDoc.CreateCDataSection(System.Text.Encoding.UTF8.GetString(manifest_html));
        xmlNode.AppendChild(xmlCData);
        xmlEle.AppendChild(xmlNode);

        xmlNode = xmlDoc.CreateNode(XmlNodeType.Element, "messagelist_html", "");
        xmlCData = xmlDoc.CreateCDataSection(System.Text.Encoding.UTF8.GetString(messagelist_html));
        xmlNode.AppendChild(xmlCData);
        xmlEle.AppendChild(xmlNode);

        Response.ContentType = "text/xml";
        Response.Write(xmlDoc.OuterXml);
        Response.End();
    }
    
    

 %>