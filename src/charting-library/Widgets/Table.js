/// <reference path="../common/utilities.js" />
/// <reference path="../utils/jquery-1.8.2.min.js" />
/// <reference path="../../utils/jquery.column.min.js" />

var ColumnMode = { "FitToWidth": 0, "FixedWidth": 1 };

(function (window) {
    var ColumnOptions = function (columnMode, columnWidth) {
        /// <summary>Column options stores stretching options of column.</summary>
        /// <param name="columnMode" type="Number">Column mode - fit to width, or fixed width column.</param>
        /// <param name="columnWidth" type="Number">Column width. if mode is 'FitToWidth', this parameter will be ignored.</param>
        this.columnMode = columnMode;
        this.columnWidth = columnWidth;
    }
    var p = ColumnOptions.prototype;
    p.columnMode = null;
    p.columnWidth = null;
    window.ColumnOptions = ColumnOptions;
}(window));


(function ($, undefined) {

    $.widget("ui.table",
    {
        prevSetColumnsWidth: null, // Previously set column width value.

        host: null, // Parent div element, which contains entire table.
        hostInnerDiv: null, // Inner div element inside host.
        clippingDiv: null, //Inside inner div, there is clipping div, which makes clipping.

        leftColumnSpan: null, // Div element with table's left column. May be null, if there is no need to fix left column.
        tableSpan: null, // Inner div element of table.

        fixLeftColumn: false, // Parameter, which identifies, whether to fix table's left column location or not.

        leftX: 0, //Left x offset of table inside host element.
        scrollY: 0,

        //creates wiget instance.
        _create: function () { },

        //initializes wiget.
        _init: function () { },

        //Initializes wiget with table jQuery object and table options.
        initialize: function (table, fixLeftColumn, removeLeftColumnHeader) {
            /// <param name="table" type="jQuery">jQuery object with table content.</param>
            /// <param name="fixLeftColumn" type="Boolean">True, if left column's location and size must be fixed. Otherwise, return false.</param>
            /// <param name="removeLeftColumnHeader" type="Boolean">True, if left colun header must be removed. Works only with fixLeftColumn.</param>

            if (this.hostInnerDiv != null) {
                this.hostInnerDiv.remove();
            }

            // perform fields initialization
            this.fixLeftColumn = fixLeftColumn;
            this.host = this.element;

            var host = this.host;

            var fixedFirstColumnTable = null;

            var divStyled = $('<div></div>');
            var hostStyle = host.attr('style');
            var hostClass = host.attr('class');

            if (hostStyle != undefined) {
                divStyled.attr('style', hostStyle);
            }
            if (hostClass != undefined) {
                divStyled.attr('class', hostClass);
            }

            divStyled.append(table);
            $('body').append(divStyled);


            var tableHeight = table.height();
            var outerTableHeight = table.outerHeight();

            var headerHeight = table.find('thead').height();
            var headerOuterHeight = table.find('thead').outerHeight();
            var bodyOuterHeight = table.find('tbody').outerHeight();

            var headerRowsHeights = [];
            var rowsHeights = [];

            table.find('thead').find('tr').each(function (index, value) {
                headerRowsHeights.push($(value).height());
            });

            table.find('tbody').find('tr').each(function (index, value) {
                rowsHeights.push($(value).innerHeight());
            });


            divStyled.remove();
            table.remove();

            var leftColOffset = 0;

            if (fixLeftColumn) {
                var firstColumnCells = table.find('td').nthCol(1);
                var firstColumnHeaderCells = table.find('th').nthCol(1);

                var firstColBody = $('<tbody></tbody>');
                var firstColRows = [];
                var addedFirstColRows = [];

                var firstRowOffset = 0;

                if (removeLeftColumnHeader) {
                    var firstRowOffset = 0;
                    if (Utilities.isMsIE || Utilities.isFirefox)
                        firstRowOffset = 1;
                    leftColOffset += headerHeight + firstRowOffset;
                }

                firstColumnCells.each(function (index, value) {
                    var parent = $(value).parent();
                    $(value).remove();
                    var idx = 0;
                    if ((idx = addedFirstColRows.indexOf(parent)) >= 0) {
                        var firstColRow = firstColRows[idx];
                        firstColRow.append($(value));
                    }
                    else {
                        var row = $('<tr></tr>');
                        var h = rowsHeights[index];
                        if (removeLeftColumnHeader && index == 0) {
                            h -= firstRowOffset;
                        }
                        row.height(h);
                        row.append($(value));
                        firstColRows.push(row);
                        addedFirstColRows.push(parent);
                    }
                });

                for (var i = 0; i < firstColRows.length; i++) {
                    firstColBody.append(firstColRows[i]);
                }

                var firstColHeader = $('<thead></thead>');
                firstColHeader.height(headerHeight);
                var firstColHeaderRows = [];
                var addedFirstColHeaderRows = [];

                for (var i = 0; i < firstColHeaderRows.length; i++) {
                    firstColBody.append(firstColHeaderRows[i]);
                }

                firstColumnHeaderCells.each(function (index, value) {
                    var parent = $(value).parent();
                    $(value).remove();
                    var idx = 0;
                    if ((idx = addedFirstColHeaderRows.indexOf(parent)) >= 0) {
                        var firstColHeaderRow = firstColHeaderRows[idx];
                        firstColHeaderRow.append($(value));
                    }
                    else {
                        var rowSpanStr = $(value).attr('rowspan');
                        var rowSpan = 1;
                        if (rowSpanStr != undefined) {
                            rowSpan = parseFloat(rowSpanStr);
                        }
                        var newH = 0;
                        for (var i = index; i < index + rowSpan; i++) {
                            newH += headerRowsHeights[i];
                        }
                        var row = $('<tr></tr>');
                        row.height(newH);
                        row.append($(value));
                        firstColHeaderRows.push(row);
                        addedFirstColHeaderRows.push(parent);
                    }
                });


                for (var i = 0; i < firstColHeaderRows.length; i++) {
                    firstColHeader.append(firstColHeaderRows[i]);
                }

                fixedFirstColumnTable = $('<table></table>');

                if (!removeLeftColumnHeader)
                    fixedFirstColumnTable.append(firstColHeader);
                fixedFirstColumnTable.append(firstColBody);

                fixedFirstColumnTable.attr("cellpadding", table.attr("cellpadding"));
                fixedFirstColumnTable.attr("cellspacing", table.attr("cellspacing"));
            }

            table.css('height', tableHeight);

            this.hostInnerDiv = $('<div></div>');
            this.clippingDiv = $('<div></div>');
            this.hostInnerDiv.css('position', 'relative').css('height', tableHeight);
            this.clippingDiv.css('position', 'absolute');

            this.clippingDiv.width(host.width());
            this.hostInnerDiv.css('overflow', 'hidden');

            this.tableSpan = $('<div></div>');//.css('display', 'inline-block');
            this.leftColumnSpan = $('<div></div>');//.css('display', 'inline-block');

            this.tableSpan.append(table);
            this.leftColumnSpan.append(fixedFirstColumnTable);

            this.tableSpan.appendTo(this.clippingDiv);
            this.leftColumnSpan.appendTo(this.clippingDiv);
            this.hostInnerDiv.append(this.clippingDiv);

            this.hostInnerDiv.appendTo(this.host);

            var leftColOuterWidth = fixedFirstColumnTable.outerWidth();
            this.leftColumnSpan.css('margin-left', -leftColOuterWidth + 1).css('margin-top', -outerTableHeight + leftColOffset);

            if (this.prevSetColumnsWidth != null)
            {
                var newColumnsWidth = this.prevSetColumnsWidth;
                this.prevSetColumnsWidth = null;
                this.setColumnsWidth(newColumnsWidth, false);
                this.setLeft(this.leftX);
            }
        },

        //Sets left coordinate of table inside host element.
        setLeft: function (leftX) {
            /// <param name="leftX" type="Number">left X offset inside host element.</param>
            this.leftX = leftX;
            this.clippingDiv.css('margin-left', this.leftX);
            this.clippingDiv.css('margin-right', -this.leftX);
        },

        //Returns table's host.
        getHost: function () {
            return this.host;
        },


        //Animates left coordinate of table inside host element.
        animateLeft: function (leftX) {
            /// <param name="leftX" type="Number">left X offset inside host element.</param>
            this.leftX = leftX;
            this.clippingDiv.animate({
                marginLeft: this.leftX,
                marginRight: -this.leftX
            }, 500);
        },


        //Sets amount of y cordinate scroll.
        setScrollY: function (scrollY) {
            /// <param name="scrollY" type="Number">Body y coordinate scroll.</param>
            this.scrollY = scrollY;
            this.tableSpan.css('morgin-top', this.scrollY);
        },

        //Animates amount of y cordinate scroll.
        animateScrollY: function (scrollY) {
            /// <param name="scrollY" type="Number">Body y coordinate scroll.</param>
            this.scrollY = scrollY;
            this.clippingDiv.animate({
                marginTop: this.scrollY,
            }, 500);
        },

        //Animates width of all columns to specified value. This method doesn't affect fixed first column.
        setColumnsWidth: function (newWidth, animate) {

            if (newWidth != this.prevSetColumnsWidth) {
                var animationDuration = 500;

                var columnsWidths = {};
                var rowsHeights = {};
                var indexes = [];

                this.tableSpan.find('tr').each(function (index, value) {
                    var curIdx = 0;
                    rowsHeights[index] =
                $(value).find('td').each(function (index2, value2) {
                        var columnSpanStr = $(value2).attr('colspan');
                        if (columnSpanStr == undefined) {
                            columnSpanStr = "1";
                        }
                        var columnSpan = parseFloat(columnSpanStr);

                        if (columnSpan == 1) {
                            var width = $(value2).width();
                            var outerWidth = $(value2).outerWidth(true);
                            var delta = outerWidth - width;

                            if (animate) {
                                $(value2).animate({
                                    width: newWidth - delta,
                                }, animationDuration);
                            }
                            else {
                                $(value2).width(newWidth - delta);
                            }

                            if (indexes.indexOf(curIdx) < 0) {
                                indexes.push(curIdx);
                                columnsWidths[curIdx] = newWidth;
                            }
                        }
                        curIdx += columnSpan;
                    });
                });

                this.tableSpan.find('tr').each(function (index, value) {
                    var curIdx = 0;
                    $(value).find('th').each(function (index2, value2) {
                        var columnSpanStr = $(value2).attr('colspan');
                        if (columnSpanStr == undefined) {
                            columnSpanStr = "1";
                        }
                        var columnSpan = parseFloat(columnSpanStr);

                        if (columnSpan == 1) {
                            var width = $(value2).width();
                            var outerWidth = $(value2).outerWidth(true);
                            var delta = outerWidth - width;

                            if (animate) {
                                $(value2).animate({
                                    width: newWidth - delta,
                                }, animationDuration);
                            }
                            else {
                                $(value2).width(newWidth - delta);
                            }

                            if (indexes.indexOf(curIdx) < 0) {
                                indexes.push(curIdx);
                                columnsWidths[curIdx] = newWidth;
                            }
                        }
                        curIdx += columnSpan;
                    });
                });

                var sumWidth = 0;

                for (var i = 0; i < indexes.length; i++) {
                    var index = indexes[i];
                    sumWidth += columnsWidths[index];
                }

                if (animate) {
                    this.tableSpan.find('table').animate({
                        width: sumWidth,
                    }, animationDuration);
                }
                else {
                    this.tableSpan.find('table').width(sumWidth);
                }

                this.prevSetColumnsWidth = newWidth;
            }
        }
    });
}(jQuery));