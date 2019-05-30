'use strict';

const Crawler = require('crawler');
const FileWriterService = require('./file-writer-service');

let counter = 0;

let meta = [];

let finished = false;


let getCode = (href, txCount) => {
    let crawler = new Crawler({

        maxConnections : 10000,
        // This will be called for each crawled page
        callback : function (error, result, $) {
            if (result) {
                let $ = result.$;
                //deletes useless start
                let code = ($("#dividcode").text()).substring (48);
                //deletes useless end
                code = code.split('var editor;$(\'.editor\')')[0];
                if (!code) { //recheck code if error occurred
                    getCode(href, txCount);

                } else {
                    FileWriterService.write('./res/contracts/contract' + counter + ".sol", code) ;
                    meta.push({
                        href: href,
                        txCount: txCount,
                        number: counter
                    });

                    counter ++;
                }



            }
        }
    });
    crawler.queue('https://etherscan.io' + href);
}

module.exports = {
    async crawEtherscan() {
        let contracts = [];
        let page = 1;
        let crawler = await new Crawler({

            maxConnections: 10000,
            // This will be called for each crawled page
            callback: function (error, result, done) {
                if (result) {
                    let $ = result.$;

                    $('tr').each(function (index, tr) {


                        if (tr.children.length >= 3) {
                            let href = tr.children[0].children && tr.children[0].children[0].children[1]? tr.children[0].children[0].children[1].attribs.href : undefined;
                            let txCount = tr.children[3].children[0] ? tr.children[3].children[0].data : undefined;
                            if (txCount && href) {
                                txCount = parseInt(txCount.replace(',', ''));
                                if (txCount > 700) {
                                    getCode(href, txCount)

                                }

                            }


                        } else {
                            finished = true;
                            FileWriterService.write('./res/meta.json', JSON.stringify(meta)) ;


                        }
                    });
                    if (!finished) {
                        page++;
                        crawler.queue('https://etherscan.io/accounts/label/token-sale/' + page);
                    } else {

                    }
                    done()


                } else {
                    console.log("error")
                }
            }
        })

        crawler.queue('https://etherscan.io/accounts/label/token-sale/' + page);

    }
}