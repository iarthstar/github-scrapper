/**
 * @file issues.js
 * @description route /issues i.e. scrapping issues of provided link
 * 
 * @author Arth Gajjar <iarthstar@gmail.com>
 */




// modules import
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();


//
// ────────────────────────────────────────────────────────── ROUTES ───────
//

/**
 * Route serving issues of the provided link
 * @name post/issues
 */
router.post('/issues', (req, res) => {
    let link = req.body.link.trim();
    link = link.endsWith('/') ? `${link}issues` : `${link}/issues`;

    let issuesArray = [];
    let links = [];

    axios.get(link)
        .then(async (response) => {
            let $ = cheerio.load(response.data);

            let issuesStr = $(`a[href="${link.split('github.com')[1]}"]`).find('span[class="Counter"]').text();
            let issues = parseInt(/(\d+)/g.exec(issuesStr)[0]);

            if (issues == 0) {

            } else {
                // SCRAPING FIRST PAGE
                let issueNodes = $('div[id^=issue_]');
                issuesArray = [...issuesArray, ...scrapeIssues($, issueNodes)];

                // If Issues are more i.e. more pages
                if (issueNodes.length != issues) {
                    // GET PAGES 
                    $('div[class="pagination"]').find('a[href]').not('[class="next_page"]').each((i, e) => {
                        links.push(`https://github.com${$(e).attr('href')}`);
                    });

                    // SCRAPING PAGES
                    await Promise.all(
                        links.map(link => {
                            return new Promise((resolve, reject) => {
                                axios.get(link)
                                    .then((response) => {
                                        let $ = cheerio.load(response.data);

                                        let issueNodes = $('div[id^=issue_]');
                                        issuesArray = [...issuesArray, ...scrapeIssues($, issueNodes)];

                                        resolve();
                                    }).catch((err) => {
                                        reject();
                                    });
                            })
                        })
                    );
                }
            }

            // SUCCESS RESPONSE OBJECT
            res.send({
                success: true,
                data: {
                    issues: issuesArray.length
                }
            });
        }).catch((error) => {
            // ERROR RESPONSE OBJECT
            res.send({
                success: false,
                data: {
                    msg: "Error fetching issues..."
                }
            })
        });
});

//
// ─────────────────────────────────────────────────────────────────────────
//




//
// ───────────────────────────────────────────────────────── HELPERS ───────
//

/**
 * scrappes issues from cheerio objects array
 * @param {any} $ cheerio
 * @param {Array} issueNodes issue nodes cheerio objects array
 * @return {Array} scrapped issue objects array
 */
function scrapeIssues($, issueNodes) {
    let issuesArray = [];
    issueNodes.each((i, e) => {
        if ($(e).find('span[aria-label="Open issue"]').length) {
            issuesArray.push({
                id: $(e).attr('id').trim().slice(6),
                datetime: $(e).find('relative-time').attr('datetime'),
                desc: $(e).find('a[data-hovercard-type="issue"]').text(),
                author: $(e).find('a[data-hovercard-type="user"]').text()
            });
        }
    });
    return issuesArray;
}

//
// ─────────────────────────────────────────────────────────────────────────
//

/**
 * @module issues
 */
module.exports = router;