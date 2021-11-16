$(function () {
  (function (H) {
    var pick = H.pick,
      Series = H.Series,
      defined = H.defined,
      distribute = H.distribute,
      arrayMax = H.arrayMax,
      merge = H.merge;

    H.seriesTypes.pie.prototype.drawDataLabels = function () {
      var series = this,
        data = series.data,
        chart = series.chart,
        options = series.options.dataLabels || {},
        connectorPadding = options.connectorPadding,
        plotWidth = chart.plotWidth,
        plotHeight = chart.plotHeight,
        plotLeft = chart.plotLeft,
        maxWidth = Math.round(chart.chartWidth / 3),
        seriesCenter = series.center,
        radius = seriesCenter[2] / 2,
        centerY = seriesCenter[1],
        halves = [
          [],
          [], // left
        ],
        overflow = [0, 0, 0, 0], // top, right, bottom, left
        dataLabelPositioners = series.dataLabelPositioners;
      var point,
        connectorWidth,
        connector,
        dataLabel,
        dataLabelWidth,
        // labelPos,
        labelPosition,
        labelHeight,
        // divide the points into right and left halves for anti collision
        x,
        y,
        visibility,
        j,
        pointDataLabelsOptions;
      // get out if not enabled
      if (!series.visible || (!options.enabled && !series._hasPointLabels)) {
        return;
      }
      // Reset all labels that have been shortened
      data.forEach(function (point) {
        if (point.dataLabel && point.visible && point.dataLabel.shortened) {
          point.dataLabel
            .attr({
              width: "auto",
            })
            .css({
              width: "auto",
              textOverflow: "clip",
            });
          point.dataLabel.shortened = false;
        }
      });
      // run parent method
      Series.prototype.drawDataLabels.apply(series);
      data.forEach(function (point) {
        if (point.dataLabel) {
          if (point.visible) {
            // #407, #2510
            // Arrange points for detection collision
            halves[point.half].push(point);
            // Reset positions (#4905)
            point.dataLabel._pos = null;
            // Avoid long labels squeezing the pie size too far down
            if (
              !defined(options.style.width) &&
              !defined(
                point.options.dataLabels &&
                  point.options.dataLabels.style &&
                  point.options.dataLabels.style.width
              )
            ) {
              if (point.dataLabel.getBBox().width > maxWidth) {
                point.dataLabel.css({
                  // Use a fraction of the maxWidth to avoid
                  // wrapping close to the end of the string.
                  width: Math.round(maxWidth * 0.7) + "px",
                });
                point.dataLabel.shortened = true;
              }
            }
          } else {
            point.dataLabel = point.dataLabel.destroy();
            // Workaround to make pies destroy multiple datalabels
            // correctly. This logic needs rewriting to support multiple
            // datalabels fully.
            if (point.dataLabels && point.dataLabels.length === 1) {
              delete point.dataLabels;
            }
          }
        }
      });
      /* Loop over the points in each half, starting from the top and bottom
       * of the pie to detect overlapping labels.
       */
      halves.forEach(function (points, i) {
        var length = points.length,
          positions = [];
        var top, bottom, naturalY, sideOverflow, size, distributionLength;
        if (!length) {
          return;
        }
        // Sort by angle
        series.sortByAngle(points, i - 0.5);
        // Only do anti-collision when we have dataLabels outside the pie
        // and have connectors. (#856)
        if (series.maxLabelDistance > 0) {
          top = Math.max(0, centerY - radius - series.maxLabelDistance);
          bottom = Math.min(
            centerY + radius + series.maxLabelDistance,
            chart.plotHeight
          );
          points.forEach(function (point) {
            // check if specific points' label is outside the pie
            if (point.labelDistance > 0 && point.dataLabel) {
              // point.top depends on point.labelDistance value
              // Used for calculation of y value in getX method
              point.top = Math.max(0, centerY - radius - point.labelDistance);
              point.bottom = Math.min(
                centerY + radius + point.labelDistance,
                chart.plotHeight
              );
              size = point.dataLabel.getBBox().height || 21;
              // point.positionsIndex is needed for getting index of
              // parameter related to specific point inside positions
              // array - not every point is in positions array.
              point.distributeBox = {
                target: point.labelPosition.natural.y - point.top + size / 2,
                size: size,
                rank: point.y,
              };
              positions.push(point.distributeBox);
            }
          });
          distributionLength = bottom + size - top;
          //distribute(positions, distributionLength, distributionLength / 5);
          distribute(positions, distributionLength, 200);
        }
        // Now the used slots are sorted, fill them up sequentially
        for (j = 0; j < length; j++) {
          point = points[j];
          // labelPos = point.labelPos;
          labelPosition = point.labelPosition;
          dataLabel = point.dataLabel;
          visibility = point.visible === false ? "hidden" : "inherit";
          naturalY = labelPosition.natural.y;
          y = naturalY;
          if (positions && defined(point.distributeBox)) {
            if (typeof point.distributeBox.pos === "undefined") {
              visibility = "hidden";
            } else {
              labelHeight = point.distributeBox.size;
              // Find label's y position
              y = dataLabelPositioners.radialDistributionY(point);
            }
          }
          // It is needed to delete point.positionIndex for
          // dynamically added points etc.
          delete point.positionIndex; // @todo unused
          // Find label's x position
          // justify is undocumented in the API - preserve support for it
          if (options.justify) {
            x = dataLabelPositioners.justify(point, radius, seriesCenter);
          } else {
            switch (options.alignTo) {
              case "connectors":
                x = dataLabelPositioners.alignToConnectors(
                  points,
                  i,
                  plotWidth,
                  plotLeft
                );
                break;
              case "plotEdges":
                x = dataLabelPositioners.alignToPlotEdges(
                  dataLabel,
                  i,
                  plotWidth,
                  plotLeft
                );
                break;
              default:
                x = dataLabelPositioners.radialDistributionX(
                  series,
                  point,
                  y,
                  naturalY
                );
            }
          }
          // Record the placement and visibility
          dataLabel._attr = {
            visibility: visibility,
            align: labelPosition.alignment,
          };
          pointDataLabelsOptions = point.options.dataLabels || {};
          dataLabel._pos = {
            x:
              x +
              pick(pointDataLabelsOptions.x, options.x) + // (#12985)
              ({
                left: connectorPadding,
                right: -connectorPadding,
              }[labelPosition.alignment] || 0),
            // 10 is for the baseline (label vs text)
            y:
              y +
              pick(pointDataLabelsOptions.y, options.y) - // (#12985)
              10,
          };
          // labelPos.x = x;
          // labelPos.y = y;
          labelPosition.final.x = x;
          labelPosition.final.y = y;
          // Detect overflowing data labels
          if (pick(options.crop, true)) {
            dataLabelWidth = dataLabel.getBBox().width;
            sideOverflow = null;
            // Overflow left
            if (
              x - dataLabelWidth < connectorPadding &&
              i === 1 // left half
            ) {
              sideOverflow = Math.round(dataLabelWidth - x + connectorPadding);
              overflow[3] = Math.max(sideOverflow, overflow[3]);
              // Overflow right
            } else if (
              x + dataLabelWidth > plotWidth - connectorPadding &&
              i === 0 // right half
            ) {
              sideOverflow = Math.round(
                x + dataLabelWidth - plotWidth + connectorPadding
              );
              overflow[1] = Math.max(sideOverflow, overflow[1]);
            }
            // Overflow top
            if (y - labelHeight / 2 < 0) {
              overflow[0] = Math.max(
                Math.round(-y + labelHeight / 2),
                overflow[0]
              );
              // Overflow left
            } else if (y + labelHeight / 2 > plotHeight) {
              overflow[2] = Math.max(
                Math.round(y + labelHeight / 2 - plotHeight),
                overflow[2]
              );
            }
            dataLabel.sideOverflow = sideOverflow;
          }
        } // for each point
      }); // for each half
      // Do not apply the final placement and draw the connectors until we
      // have verified that labels are not spilling over.
      if (arrayMax(overflow) === 0 || this.verifyDataLabelOverflow(overflow)) {
        // Place the labels in the final position
        this.placeDataLabels();
        this.points.forEach(function (point) {
          // #8864: every connector can have individual options
          pointDataLabelsOptions = merge(options, point.options.dataLabels);
          connectorWidth = pick(pointDataLabelsOptions.connectorWidth, 1);
          // Draw the connector
          if (connectorWidth) {
            var isNew = void 0;
            connector = point.connector;
            dataLabel = point.dataLabel;
            if (
              dataLabel &&
              dataLabel._pos &&
              point.visible &&
              point.labelDistance > 0
            ) {
              visibility = dataLabel._attr.visibility;
              isNew = !connector;
              if (isNew) {
                point.connector = connector = chart.renderer
                  .path()
                  .addClass(
                    "highcharts-data-label-connector " +
                      " highcharts-color-" +
                      point.colorIndex +
                      (point.className ? " " + point.className : "")
                  )
                  .add(series.dataLabelsGroup);
                if (!chart.styledMode) {
                  connector.attr({
                    "stroke-width": connectorWidth,
                    stroke:
                      pointDataLabelsOptions.connectorColor ||
                      point.color ||
                      "#666666" /* neutralColor60 */,
                  });
                }
              }
              connector[isNew ? "attr" : "animate"]({
                d: point.getConnectorPath(),
              });
              connector.attr("visibility", visibility);
            } else if (connector) {
              point.connector = connector.destroy();
            }
          }
        });
      }
    };
  })(Highcharts);
  $("#container").highcharts({
    title: null,
    marginLeft: 0,
    marginRight: 0,
    spacingLeft: 0,
    spacingRight: 0,
    chart: {
      type: "pie",
      zoomType: "xy",
    },

    plotOptions: {
      pie: {
        borderWidth: 0,
        size: 160,
        innerSize: 50,
        dataLabels: {
          enabled: true,
          allowOverlap: true,
        },
        states: {
          hover: {
            enabled: true,
          },
        },
      },
    },

    series: [
      {
        data: [
          ["Test1", 111110.4],
          ["Test2", 0.4],
          ["Test3", 0.4],
          ["Test4", 0.4],
          ["Test5", 0.4],
          ["Test6", 0.4],
          ["Test7", 0.4],
          ["Test8", 0.4],
          ["Test9", 75.4],
          ["Test10", 732.4],
        ],
        showInLegend: false,
      },
    ],
  });
});
