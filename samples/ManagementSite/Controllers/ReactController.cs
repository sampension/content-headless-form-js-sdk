using EPiServer;
using EPiServer.Core;
using EPiServer.Forms.Implementation.Elements;
using EPiServer.ServiceLocation;
using EPiServer.SpecializedProperties;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace AlloyMvcTemplates.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ReactController : ControllerBase
{
    public ReactController()
    {
    }

    [HttpGet("GetFormInPageByUrl")]
    public async Task<IActionResult> GetFormInPageByUrl(string url)
    {
        var builder = new EPiServer.UrlBuilder(url);
        var content = UrlResolver.Current.Route(builder, ContextMode.Default);

        if (content is null)
        {
            return NoContent();
        }
        CancellationTokenSource source = new CancellationTokenSource();
        CancellationToken token = source.Token;

        var contentLoader = ServiceLocator.Current.GetInstance<IContentLoader>();

        var pageContent = contentLoader.Get<IContent>(content.ContentGuid);

        var pageModel = new PageModel();

        if (pageContent is not null)
        {
            pageModel.Title = pageContent.Name;
            pageModel.PageUrl = UrlResolver.Current.GetUrl(content.ContentLink);

            if (pageContent.Property.Keys.Contains("MainContentArea"))
            {
                var contentArea = pageContent.Property["MainContentArea"] as PropertyContentArea;
                foreach (var item in contentArea.PublicContentArea.FilteredItems)
                {
                    var contentItem = contentLoader.Get<IContent>(item.ContentLink);

                    if(contentItem is FormContainerBlock)
                    {
                        pageModel.FormKeys.Add(contentItem.ContentGuid.ToString("N"));
                    }
                }
            }
        }

        return Ok(pageModel);
    }
}

public class PageModel
{
    public string Title { get; set; }
    public string PageUrl { get; set; }
    public List<string> FormKeys { get; set; } = new List<string>();
}