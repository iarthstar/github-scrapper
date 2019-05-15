/**
 * @file issues.js
 * @description route /issues i.e. scrapping issues of provided link
 * 
 * @author Arth Gajjar <iarthstar@gmail.com>
 */




// modules import
const express = require('express');
const axios = require('axios');

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
    let tested = /(((http)|(https)|())(:\/\/)(www.)*)*(github.com\/)(.+)(\/)(.+)(\/*)/.exec(link);
    link = `https://api.github.com/repos/${tested[9]}/${tested[11]}`;

    let issuesArray = [];

    axios({
            method: 'get',
            url: link,
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
        })
        .then(async (response) => {
            let data = response.data;

            // If Repository has issues
            if(data.has_issues){
                let noOfPages = Math.ceil(data.open_issues / 100);
                let links = [];

                // Generating page links to fetch issues
                for (let index = 1; index <= noOfPages; index++) {
                    links.push(`https://api.github.com/repositories/${data.id}/issues?page=${index}&per_page=100`);
                }

                // Fetching issues by iterating over page links
                await Promise.all(
                    links.map(link => {
                        return new Promise((resolve, reject) => {
                            axios({
                                    method: 'get',
                                    url: link,
                                    headers: {
                                        'Accept': 'application/vnd.github.v3+json'
                                    },
                                })
                                .then((response) => {
                                    issuesArray.push(...response.data);
                                    resolve();
                                }).catch((err) => {
                                    resolve();
                                });
                        });
                    })
                );

                issuesArray = issuesArray.filter(elem => !elem.hasOwnProperty('pull_request'));

                let yesterdayTime = new Date(Date.now() - (24 * 60 * 60 * 1000));
                let lastWeekTime = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));;
                let yesterday = 0,
                    lastWeek = 0,
                    other = 0;

                // Transforming issues as per requirement
                issuesArray.forEach(elem => {

                    let createdAt = new Date(elem.created_at);
                    if (createdAt > yesterdayTime) {
                        yesterday++;
                    } else if (createdAt > lastWeekTime && createdAt <= yesterdayTime) {
                        lastWeek++;
                    } else {
                        other++;
                    }
                });

                // SUCCESS RESPONSE OBJECT
                res.send({
                    success: true,
                    data: {
                        yesterday,
                        lastWeek,
                        other
                    }
                });
            } else {
                // If zero issues
                res.send({
                    success: true,
                    data: {
                        yesterday: 0,
                        lastWeek: 0,
                        other: 0
                    }
                });
            }
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


/**
 * @module issues
 */
module.exports = router;