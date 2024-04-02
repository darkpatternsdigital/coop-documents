- [ ] Improve Print Layout
    - See https://medium.com/printcss/printcss-table-of-contents-6156df7b5529

        ```css

            @page  {
                size: A6;
                margin: 20mm;

                @top-left{
                    content: element(headerLeft);
                    border-bottom:2px solid #434190;
                }

                @top-center{
                    border-bottom:2px solid #434190;
                }

                @top-right{
                    content: element(headerRight);
                    border-bottom:2px solid #434190;
                }

                @bottom-right {
                    content: element(footerRight);
                    border-top:2px solid #434190;
                }

                @bottom-center{
                    content: counter(page) ' / ' counter(pages);
                    border-top:2px solid #434190;
                    font-size:8pt;
                }

                @bottom-left{
                    content: element(footerLeft);
                    border-top:2px solid #434190;
                }
            }

            /** Headers and footers */
            .headerLeft{
                position: running(headerLeft);
                font-size:12pt;
            }

            .headerRight{
                position: running(headerRight);
                font-size:8pt;
                font-style: italic;
                text-align: right;
                color:#667eea;
            }

            .footerLeft{
                position: running(footerLeft);
            }

            .footerLeft img{
                width:20mm;
            }

            .footerRight{
                position: running(footerRight);
                text-align: right;
                font-size:8pt;
            }

            /** Table of contents, where href links to the id, which displays the page */
            .toc a{
                display:block;
            }

            .toc a::after {
                content: leader(".") target-counter(attr(href), page);
            }
        ```
- [ ] Render to PDF via GitHub Actions