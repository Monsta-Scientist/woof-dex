import './index.css';

import * as React from 'react';
import * as saveLoadAdapter from './saveLoadAdapter';

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  widget,
} from '../../charting_library';

import { flatten } from '../../utils/utils';
import { useMarket } from '../../utils/markets';
import { useTvDataFeed } from '../../utils/Datafeed';

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];
  auto_save_delay: ChartingLibraryWidgetOptions['auto_save_delay'];

  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  containerId: ChartingLibraryWidgetOptions['container_id'];
  theme: string;
  timeframe: ChartingLibraryWidgetOptions['timeframe'];
}

export interface ChartContainerState {}

export const TVChartContainer = () => {
  let datafeed = useTvDataFeed();
  const defaultProps: ChartContainerProps = {
    symbol: 'LABS/USDC',
    // @ts-ignore
    interval: '60',
    auto_save_delay: 5,
    theme: 'Dark',
    containerId: 'tv_chart_container',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
    timeframe: '1D'
  };

  const tvWidgetRef = React.useRef<IChartingLibraryWidget | null>(null);
  const { marketName } = useMarket();

  const chartProperties = JSON.parse(
    localStorage.getItem('chartproperties') || '{}',
  );

  React.useEffect(() => {
    const savedProperties = flatten(chartProperties, {
      restrictTo: ['scalesProperties', 'paneProperties', 'tradingProperties'],
    });

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: marketName as string,
      datafeed: datafeed,
      interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
      container_id: defaultProps.containerId as ChartingLibraryWidgetOptions['container_id'],
      library_path: defaultProps.libraryPath as string,
      auto_save_delay: 5,

      locale: 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      load_last_chart: true,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      theme: defaultProps.theme === 'Dark' ? 'Dark' : 'Light',
      overrides: {
        ...savedProperties,
        'mainSeriesProperties.candleStyle.upColor': '#84CC16',
        'mainSeriesProperties.candleStyle.downColor': '#EF4444',
        // 'mainSeriesProperties.candleStyle.borderColor': '#378658',
        'mainSeriesProperties.candleStyle.borderUpColor': '#84CC16',
        'mainSeriesProperties.candleStyle.borderDownColor': '#EF4444',
        'mainSeriesProperties.candleStyle.wickUpColor': '#84CC16',
        'mainSeriesProperties.candleStyle.wickDownColor': '#EF4444',
      },
      // @ts-ignore
      save_load_adapter: saveLoadAdapter,
      settings_adapter: {
        initialSettings: {
          'trading.orderPanelSettingsBroker': JSON.stringify({
            showRelativePriceControl: false,
            showCurrencyRiskInQty: false,
            showPercentRiskInQty: false,
            showBracketsInCurrency: false,
            showBracketsInPercent: false,
          }),
          // "proterty"
          'trading.chart.proterty':
            localStorage.getItem('trading.chart.proterty') ||
            JSON.stringify({
              hideFloatingPanel: 1,
            }),
          'chart.favoriteDrawings':
            localStorage.getItem('chart.favoriteDrawings') ||
            JSON.stringify([]),
          'chart.favoriteDrawingsPosition':
            localStorage.getItem('chart.favoriteDrawingsPosition') ||
            JSON.stringify({}),
        },
        setValue: (key, value) => {
          localStorage.setItem(key, value);
        },
        removeValue: (key) => {
          localStorage.removeItem(key);
        },
      },
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidgetRef.current = tvWidget;
      tvWidget
        // @ts-ignore
        .subscribe('onAutoSaveNeeded', () => tvWidget.saveChartToServer());
    });
  }, [chartProperties, datafeed, defaultProps.autosize, defaultProps.clientId, defaultProps.containerId, defaultProps.fullscreen, defaultProps.interval, defaultProps.libraryPath, defaultProps.studiesOverrides, defaultProps.theme, defaultProps.userId, marketName]);

  return <div style={{ height: 640, width: "97%", margin: "auto", border: "1px solid rgb(238, 238, 238, 0.2)", borderRadius: "5px"}} id={defaultProps.containerId} className={'TVChartContainer'} />;
};
