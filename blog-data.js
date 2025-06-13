// Auto-generated blog data
window.blogData = {
  "posts": [
    {
      "id": "post_1749843847136_j0dqmsdsl",
      "title": "Controlling app access on a specific SharePoint site collections",
      "category": "soc",
      "excerpt": "Learn how to properly configure SharePoint app permissions when dealing with expired secrets and the Sites.Selected permission to ensure full access to specific SharePoint sites.",
      "tags": [
        "Microsoft",
        "SharePoint",
        "Site",
        "Azure",
        "Permissions"
      ],
      "content": "<p>Imagine facing a significant challenge when your automation processes suddenly fail due to expired SharePoint secrets, interrupting access to a key SharePoint site and bringing operations to a halt. After reaching out to the IT team, they promptly replaced the outdated app in Azure Apps with a new one, generating fresh credentials —<em>&nbsp;tenant ID, secrets, and Application (Client) ID</em>. These credentials are vital for our automation workflows, enabling access to the SharePoint platform, including specific sites.</p><p>However, a new challenge arose when the IT team assigned the “<strong>Sites.Selected</strong>” permission under Microsoft Graph Sites. By default, this permission does not grant access to any SharePoint site collections unless explicitly configured. With only the “Sites.Selected” permission assigned, the application was denied access to the necessary SharePoint sites.</p><p>To ensure access to specific sites within SharePoint, explicit permissions need to be defined for each site. Both the IT team and your team need to collaborate and follow specific steps when setting up permissions for newly created applications.</p><p>In this post, I’ll outline these collaborative steps to help ensure full access to SharePoint sites moving forward.</p><p><strong>Steps:</strong></p><p><strong>1. Azure App Setup (Initial Configuration)</strong></p><ul><li><strong>Azure App Creation:</strong>&nbsp;The IT team creates the app in Azure AD and shares App name, App(Client ID), Tenant ID and Secrets with you.</li><li><strong>Permission Assignment:</strong>&nbsp;The app is assigned the “<strong>Sites.Selected</strong>” permission. This does not automatically grant access to any SharePoint site but enables specific access to be configured later via the Microsoft Graph API.</li></ul><p><br></p><p><img src=\"https://miro.medium.com/v2/resize:fit:700/1*M_6i9inSQ3vsO08pVFn-tQ.png\" height=\"500\" width=\"700\"></p><p>Microsoft Graph Sites</p><p><strong>2. App Attempts to Access SharePoint Site</strong></p><ul><li><strong>App Request:</strong>&nbsp;The app attempts to access a SharePoint site collection (e.g., to read/write data).</li><li><strong>Initial Denial:</strong>&nbsp;Since the app has only the “Sites.Selected” permission, access is denied to any SharePoint site&nbsp;<strong>unless permissions are explicitly granted</strong>.</li></ul><p><strong>3. Admin Grants Site Permissions (via Microsoft Graph API)</strong></p><ul><li>You’ve to make and share an API with IT team which SharePoint admin will call to provide access to a specific site(<strong>MSSP</strong>) with in the SharePoint.</li><li><strong>API Call (POST /permissions):</strong>&nbsp;Following API will be called on Graph explorer by SharePoint admin:</li></ul><p><br></p><pre class=\"ql-syntax\" spellcheck=\"false\">Method: POST API: https://graph.microsoft.com/v1.0/sites/site_id_comes_here/permissions Request Body: { \"roles\": [ \"read\", \"write\" ], \"grantedToIdentities\": [ { \"application\": { \"id\": \"application_id_comes_here\", \"displayName\": \"application_name_comes_here\" } } ] } </pre><p><img src=\"https://miro.medium.com/v2/resize:fit:700/1*xi0hFLtQBtgecJZBccR_sQ.png\" height=\"215\" width=\"700\"></p><p>Graph Explorer</p><p>Replace Application ID and display name with the new App data shared by IT team. Get Site ID from IT team if it is handled by IT team, if it is handled by you team you can get it easily by making following API call on Graph Explorer.</p><p><em>GET&nbsp;</em><a href=\"https://graph.microsoft.com/v1.0/sites?search=\" target=\"_blank\" style=\"color: inherit;\"><em>https://graph.microsoft.com/v1.0/sites?search=</em></a><em>your_site_name.</em></p><p><img src=\"https://miro.medium.com/v2/resize:fit:700/1*hEujvDpr5IEL1-MLKI1spw.png\" height=\"240\" width=\"700\"></p><p>Graph Explorer</p><ul><li><strong>Roles &amp; Permissions:</strong>&nbsp;The request grants specific roles (e.g., “read” or “write”) for the SharePoint site, defining what actions the app can perform.</li></ul><p><br></p><p><strong>4. App Receives Access</strong></p><ul><li><strong>Access Granted:</strong>&nbsp;Once the API call is successful, the app receives the necessary permissions (e.g write, read) for the specified SharePoint site.</li></ul><p><br></p><p><img src=\"https://miro.medium.com/v2/resize:fit:700/1*6trWMRvGF9e68nRD_vl8lg.png\" height=\"451\" width=\"700\"></p><p>Site access workflow</p><p>This setup will surely give you required access, you can ask if any assistance is required.</p><p>Reference:&nbsp;<a href=\"https://devblogs.microsoft.com/microsoft365dev/controlling-app-access-on-specific-sharepoint-site-collections/\" target=\"_blank\" style=\"color: inherit;\">Microsoft Documentation</a></p>",
      "status": "published",
      "image": "",
      "date": "2025-06-13T19:44:07.136Z",
      "lastModified": "2025-06-13T19:44:07.136Z",
      "views": 0,
      "likes": 0,
      "comments": []
    }
  ],
  "categories": {
    "soc": 1
  },
  "lastUpdated": "2025-06-13T19:44:08.473Z"
};