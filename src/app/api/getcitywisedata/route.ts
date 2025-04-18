import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

type Project = {
    name: string;
    url?: string;
    location: string;
    price?: string;
    image?: string;
    builder: string | null;
    video: {
        thumbnail: string | null;
        views: string | null;
        author: string | null;
        followers: string | null;
    };
    tags: { title: string; description: string }[];
    cta_buttons: string[];
    coordinates: {
        lat: number;
        lng: number;
    };
};

export async function GET(req: NextRequest) {
    const cityName = req.nextUrl.searchParams.get('city');
    console.log("📍 City Name:", cityName);

    if (!cityName) {
        return NextResponse.json({ error: 'City name is required in query param ?city=' }, { status: 400 });
    }

    try {
        const url = `https://www.magicbricks.com/new-projects-${cityName}`;
        console.log("🌐 Fetching URL:", url);

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        const $ = cheerio.load(data);
        const projects: Project[] = [];

        const elements = $(".projdis__prjcard").toArray();

        for (const element of elements) {
            const name = $(element).find('.mghome__prjblk__prjname').text().trim();
            const url = $(element).find(".mghome__prjblk__prjname").attr("href")?.trim();
            const location = $(element).find(".mghome__prjblk__locname").text().trim();
            const price = $(element).find(".mghome__prjblk__price").text().trim();
            const image = $(element).find(".mghome__prjblk__imgsec__img").attr("data-src");

            const videoThumbnail = $(element).find(".mghome__videocard__thumbnail__image").attr("data-src") || null;
            const videoViews = $(element).find(".mghome__videocard__thumbnail__views").text().trim() || null;
            const videoAuthor = $(element).find(".mghome__videocard__author__name").text().trim() || null;
            const videoFollowers = $(element).find(".mghome__videocard__author__followers").text().trim() || null;

            const project: Project = {
                name,
                url,
                location,
                price,
                image,
                builder: null,
                video: {
                    thumbnail: videoThumbnail,
                    views: videoViews,
                    author: videoAuthor,
                    followers: videoFollowers,
                },
                tags: [],
                cta_buttons: [],
                coordinates: {
                    lat: 0,
                    lng: 0,
                },
            };

            $(element).find(".mghome__linkblks__card").each((_, tagCard) => {
                const title = $(tagCard).find(".mghome__linkblks__card__tag").text().trim();
                const desc = $(tagCard).find(".mghome__linkblks__card__txt").text().trim();

                if (title && desc) {
                    console.log(`    🏷️ Tag: ${title} - ${desc}`);
                    project.tags.push({ title, description: desc });
                }
            });

            $(element).find(".projdis__prjcard__cta").each((_, cta) => {
                const text = $(cta).text().trim();
                if (text) {
                    console.log(`    🔘 CTA Button: ${text}`);
                    project.cta_buttons.push(text);
                }
            });

            if (project.name && project.location) {
                const result = await axios.get(`http://api.positionstack.com/v1/forward?access_key=3ec4c315a8db450625aba99ba707d8cd&query=${project.location}`);
                console.log(result);
                project.coordinates.lat = result.data.data[0].latitude;
                project.coordinates.lng = result.data.data[0].longitude;
                projects.push(project);
            } else {
                console.warn(`⚠️ Skipped project due to missing name/location:`, project);
            }
        }

        // console.log("Total Valid Projects Parsed:", projects);
        return NextResponse.json(projects, { status: 200 });

    } catch (error: any) {
        console.error("Scraping Error:", error.message);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
