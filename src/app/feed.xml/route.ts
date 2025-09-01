import { supabaseAdmin } from '@/lib/supabaseAdminClient'

export async function GET() {
  const baseUrl = 'https://openillust.com'
  
  try {
    // Get latest 20 illustrations
    const { data: illustrations } = await supabaseAdmin
      .from('illustrations')
      .select(`
        id,
        title,
        description,
        image_url,
        created_at,
        updated_at,
        download_count_svg,
        download_count_png,
        categories (
          name
        ),
        tags (
          name
        )
      `)
      .eq('visible', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!illustrations) {
      throw new Error('No illustrations found')
    }

    const rssItems = illustrations.map((item) => {
      const categoryNames = item.categories?.map((c: any) => c.name).join(', ') || 'Uncategorized'
      const tagNames = item.tags?.map((t: any) => t.name).join(', ') || ''
      const totalDownloads = (item.download_count_svg || 0) + (item.download_count_png || 0)
      
      return `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description || `Free ${item.title} illustration for commercial use. Download in SVG or PNG format. Categories: ${categoryNames}${tagNames ? `. Tags: ${tagNames}` : ''}.`}]]></description>
      <link>${baseUrl}/illustration/${item.id}</link>
      <guid isPermaLink="true">${baseUrl}/illustration/${item.id}</guid>
      <pubDate>${new Date(item.created_at).toUTCString()}</pubDate>
      <category><![CDATA[${categoryNames}]]></category>
      <enclosure url="${item.image_url}" type="image/svg+xml" />
      <author>noreply@openillust.com (OpenIllust)</author>
      <source url="${baseUrl}/feed.xml">OpenIllust - Free Illustrations</source>
      <dc:creator><![CDATA[OpenIllust]]></dc:creator>
      <content:encoded><![CDATA[
        <p>${item.description || `Download this free ${item.title} illustration for commercial use.`}</p>
        <p><strong>Categories:</strong> ${categoryNames}</p>
        ${tagNames ? `<p><strong>Tags:</strong> ${tagNames}</p>` : ''}
        <p><strong>Downloads:</strong> ${totalDownloads} times</p>
        <p><a href="${baseUrl}/illustration/${item.id}">View and Download →</a></p>
        <img src="${item.image_url}" alt="${item.title}" style="max-width: 100%; height: auto;" />
      ]]></content:encoded>
    </item>`
    }).join('')

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenIllust - Free Illustrations</title>
    <description>Latest free illustrations for commercial use. Download instantly, no signup required. 10 free downloads daily.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <managingEditor>noreply@openillust.com (OpenIllust)</managingEditor>
    <webMaster>noreply@openillust.com (OpenIllust)</webMaster>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js OpenIllust RSS Generator</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <cloud domain="rpc.sys.com" port="80" path="/RPC2" registerProcedure="pingMe" protocol="soap"/>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>OpenIllust</title>
      <link>${baseUrl}</link>
      <description>Free illustrations for commercial use</description>
    </image>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <category>Design</category>
    <category>Illustrations</category>
    <category>Graphics</category>
    <category>Free Resources</category>
    ${rssItems}
  </channel>
</rss>`

    return new Response(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    })

  } catch (error) {
    console.error('Error generating RSS feed:', error)
    
    // Return a basic RSS feed even if there's an error
    const errorRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>OpenIllust - Free Illustrations</title>
    <description>Latest free illustrations for commercial use. Download instantly, no signup required.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <item>
      <title>RSS Feed Temporarily Unavailable</title>
      <description>We're experiencing technical difficulties. Please visit our website directly.</description>
      <link>${baseUrl}</link>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
  </channel>
</rss>`

    return new Response(errorRssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes on error
      },
    })
  }
}