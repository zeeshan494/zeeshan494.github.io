// Auto-generated blog data - This file will be updated by the admin system
window.blogData = {
  posts: [
    {
      id: "post_1642089600000_abc123",
      title: "Controlling app access on a specific SharePoint site collections",
      category: "cloud-security",
      excerpt:
        "Learn how to properly configure SharePoint app permissions when dealing with expired secrets and the Sites.Selected permission to ensure full access to specific SharePoint sites.",
      tags: ["Microsoft", "SharePoint", "Site", "Azure", "Permissions"],
      content: `
        <p>Imagine facing a significant challenge when your automation processes suddenly fail due to expired SharePoint secrets, interrupting access to a key SharePoint site and bringing operations to a halt. After reaching out to the IT team, they promptly replaced the outdated app in Azure Apps with a new one, generating fresh credentials — <strong>tenant ID, secrets, and Application (Client) ID</strong>. These credentials are vital for our automation workflows, enabling access to the SharePoint platform, including specific sites.</p>
        
        <p>However, a new challenge arose when the IT team assigned the <strong>"Sites.Selected"</strong> permission under Microsoft Graph Sites. By default, this permission does not grant access to any SharePoint site collections unless explicitly configured. With only the "Sites.Selected" permission assigned, the application was denied access to the necessary SharePoint sites.</p>
        
        <p>To ensure access to specific sites within SharePoint, explicit permissions need to be defined for each site. Both the IT team and your team need to collaborate and follow specific steps when setting up permissions for newly created applications.</p>
        
        <p>In this post, I'll outline these collaborative steps to help ensure full access to SharePoint sites moving forward.</p>
        
        <h3>Steps:</h3>
        
        <h4>1. Azure App Setup (Initial Configuration)</h4>
        
        <ul>
          <li><strong>Azure App Creation:</strong> The IT team creates the app in Azure AD and shares App name, App(Client ID), Tenant ID and Secrets with you.</li>
          <li><strong>Permission Assignment:</strong> The app is assigned the <strong>"Sites.Selected"</strong> permission. This does not automatically grant access to any SharePoint site but enables specific access to be configured later via the Microsoft Graph API.</li>
        </ul>
        
        <h4>2. Site-Specific Permission Configuration</h4>
        
        <p>Once the Azure app is created with the Sites.Selected permission, you need to explicitly grant the app access to specific SharePoint sites. This is done using the Microsoft Graph API.</p>
        
        <h4>3. Grant Site Permissions via Graph API</h4>
        
        <p>To grant the application access to a specific SharePoint site, you'll use the Microsoft Graph API to assign site-level permissions. Here's how:</p>
        
        <ul>
          <li><strong>Identify the Site ID:</strong> First, you need to get the Site ID of the SharePoint site you want to grant access to.</li>
          <li><strong>Use Graph API:</strong> Make a POST request to the Microsoft Graph API to grant permissions.</li>
          <li><strong>Verify Access:</strong> Test the application's access to ensure it can read/write to the specified site.</li>
        </ul>
        
        <h4>4. Testing and Validation</h4>
        
        <p>After configuring the permissions:</p>
        
        <ul>
          <li>Test the application's ability to access the SharePoint site</li>
          <li>Verify that all required operations (read, write, delete) work as expected</li>
          <li>Document the configuration for future reference</li>
        </ul>
        
        <h4>5. Ongoing Maintenance</h4>
        
        <p>Remember to:</p>
        
        <ul>
          <li>Monitor secret expiration dates</li>
          <li>Set up alerts for upcoming expirations</li>
          <li>Maintain documentation of all configured sites</li>
          <li>Regular access testing to ensure continued functionality</li>
        </ul>
        
        <p>By following these collaborative steps, you can ensure that your applications maintain proper access to SharePoint sites while adhering to security best practices and the principle of least privilege.</p>
      `,
      status: "published",
      image: "",
      date: "2025-01-15T10:00:00.000Z",
      lastModified: "2025-01-15T10:00:00.000Z",
      views: 245,
      likes: 0,
      comments: [],
    },
  ],
  categories: {
    "cloud-security": 1,
  },
  lastUpdated: "2025-01-15T10:00:00.000Z",
}
