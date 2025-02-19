import BalancesTable from './BalancesTable';
import OpenOrderTable from './OpenOrderTable';
import React, { useState } from 'react';
import { Col, Row } from 'antd';
import FillsTable from './FillsTable';
import FloatingElement from '../layout/FloatingElement';
import FeesTable from './FeesTable';
import { useOpenOrders, useBalances, useMarket } from '../../utils/markets';

export default function Index() {
  const { market } = useMarket();
  const [activeKeyStr, setActiveKeyStr] = useState('orders');
  return (
    <FloatingElement style={{ flex: 1, paddingTop: 20, margin: 20 }}>
      <Row>
        <Col
          span={24 / (market && market.supportsSrmFeeDiscounts ? 4 : 3)}
          onClick={() => setActiveKeyStr('orders')}
          style={{
            height: 42,
            width: '50%',
            textAlign: 'center',
            border: 'transparent',
            borderBottom: activeKeyStr === 'orders' ? '2px solid #FCD34D' : '',
            background: 'transparent',
            fontSize: 14,
            fontStyle: 'normal',
            cursor: 'pointer',
            fontWeight: 600,
            color:
              activeKeyStr === 'orders'
                ? '#F1F1F2'
                : // : 'rgba(241, 241, 242, 0.5)',
                  '#FCD34D',
            padding: '12px 0 12px',
            opacity: activeKeyStr === 'orders' ? 1 : 0.8,
          }}
        >
          Open Orders
        </Col>
        <Col
          span={24 / (market && market.supportsSrmFeeDiscounts ? 4 : 3)}
          onClick={() => setActiveKeyStr('fills')}
          style={{
            height: 42,
            width: '50%',
            textAlign: 'center',
            border: 'transparent',
            borderBottom: activeKeyStr === 'fills' ? '2px solid #232323' : '',
            background: 'transparent',
            fontSize: 14,
            cursor: 'pointer',
            fontStyle: 'normal',
            fontWeight: 600,
            color: activeKeyStr === 'fills' ? '#F1F1F2' : '#FCD34D',
            padding: '12px 0 12px',
            opacity: activeKeyStr === 'fills' ? 1 : 0.8,
          }}
        >
          Recent Trade History
        </Col>
        <Col
          span={24 / (market && market.supportsSrmFeeDiscounts ? 4 : 3)}
          onClick={() => setActiveKeyStr('balances')}
          style={{
            height: 42,
            width: '50%',
            textAlign: 'center',
            border: 'transparent',
            borderBottom:
              activeKeyStr === 'balances' ? '2px solid #232323' : '',
            background: 'transparent',
            fontSize: 14,
            cursor: 'pointer',
            fontStyle: 'normal',
            fontWeight: 600,
            color: activeKeyStr === 'balances' ? '#F1F1F2' : '#FCD34D',
            padding: '12px 0 12px',
            opacity: activeKeyStr === 'balances' ? 1 : 0.8,
          }}
        >
          Balances
        </Col>
        {market && market.supportsSrmFeeDiscounts ? (
          <Col
            span={24 / (market && market.supportsSrmFeeDiscounts ? 4 : 3)}
            onClick={() => setActiveKeyStr('fees')}
            style={{
              height: 42,
              width: '50%',
              textAlign: 'center',
              border: 'transparent',
              borderBottom: activeKeyStr === 'fees' ? '2px solid #232323' : '',
              background: 'transparent',
              fontSize: 14,
              fontStyle: 'normal',
              cursor: 'pointer',
              fontWeight: 600,
              color: activeKeyStr === 'fees' ? '#F1F1F2' : '#FCD34D',
              padding: '12px 0 12px',
              opacity: activeKeyStr === 'fees' ? 1 : 0.8,
            }}
          >
            Fee Discounts
          </Col>
        ) : null}
      </Row>
      <div
        style={{
          border: '1px solid #232323',
          height: 400,
          borderBottom: '',
          padding: 16,
          margin: 0,
          marginTop: 16,
        }}
      >
        {activeKeyStr && activeKeyStr === 'orders' ? <OpenOrdersTab /> : null}
        {activeKeyStr && activeKeyStr === 'fills' ? <FillsTable /> : null}
        {activeKeyStr && activeKeyStr === 'balances' ? <BalancesTab /> : null}
        {activeKeyStr && activeKeyStr === 'fees' ? <FeesTable /> : null}
      </div>
    </FloatingElement>
  );
}

const OpenOrdersTab = () => {
  const openOrders = useOpenOrders();

  return <OpenOrderTable openOrders={openOrders} />;
};

const BalancesTab = () => {
  const balances = useBalances();

  return <BalancesTable balances={balances} />;
};
