import React, { useState } from 'react';

import styled from 'styled-components';
import { Button, Col, Row } from 'antd';
import { cancelOrder } from '../../utils/send';
import { useWallet } from '../../utils/wallet';
import { useSendConnection } from '../../utils/connection';
import { notify } from '../../utils/notifications';
import { OrderWithMarketAndMarketName } from '../../utils/types';

const CancelButton = styled(Button)`
  color: rgba(241, 241, 242, 1);
  border-radius: 4px;
  width: 65px;
  height: 20px;
  font-size: 10;
  padding: 0;
  margin: 0;
`;

export default function OpenOrderTable({
  openOrders,
  onCancelSuccess,
  pageSize,
  loading,
  marketFilter,
}: {
  openOrders: OrderWithMarketAndMarketName[] | null | undefined;
  onCancelSuccess?: () => void;
  pageSize?: number;
  loading?: boolean;
  marketFilter?: boolean;
}) {
  let { wallet } = useWallet();
  let connection = useSendConnection();

  const [cancelId, setCancelId] = useState(null);

  async function cancel(order) {
    setCancelId(order?.orderId);
    try {
      if (wallet) {
      await cancelOrder({
        order,
        market: order.market,
        connection,
        wallet,
      });
    } else {
      throw Error('Error cancelling order')
    }
    } catch (e) {
      notify({
        message: 'Error cancelling order',
        description: e.message,
        type: 'error',
      });
      return;
    } finally {
      setCancelId(null);
    }
    onCancelSuccess && onCancelSuccess();
  }

  const dataSource = (openOrders || []).map((order) => ({
    ...order,
    key: order.orderId,
  }));

  return (
    <Row>
      <Col span={24}>
        <Row style={{fontSize: 14, color: '#FCD34D', opacity: 0.5, paddingBottom: 16 }}>
          <Col span={5} style={{textAlign: 'left', fontWeight: 'bold', textDecorationLine: 'underline' }}>Market</Col>
          <Col span={5} style={{textAlign: 'right', fontWeight: 'bold', textDecorationLine: 'underline' }}>Side</Col>
          <Col span={5} style={{textAlign: 'right', fontWeight: 'bold', textDecorationLine: 'underline' }}>Size</Col>
          <Col span={5} style={{textAlign: 'right', fontWeight: 'bold', textDecorationLine: 'underline' }}>Price</Col>
          <Col span={4} style={{textAlign: 'right', fontWeight: 'bold', textDecorationLine: 'underline' }}> </Col>
        </Row>
        <div style={{ height: 250, overflowX: 'hidden' }}>
          {dataSource.map(({marketName, side, size, price, orderId }, i) => (
            <Row key={i} style={{fontSize: 14, color: '#FCD34D', paddingBottom: 16 }}>
              <Col span={5} style={{ textAlign: 'left' }}>{marketName}</Col>
              {/* <Col span={5} style={{ textAlign: 'right', color: 'rgba(90, 196, 190, 1)' }}>{side}</Col>
              <Col span={5} style={{ textAlign: 'right', color: 'rgba(90, 196, 190, 1)' }}>{size}</Col>
               */}
              <Col span={5} style={{textAlign: 'right', color: '#FCD34D' }}>{side}</Col>
              <Col span={5} style={{textAlign: 'right', color: '#FCD34D' }}>{size}</Col>
              <Col span={5} style={{textAlign: 'right' }}>{price}</Col>
              <Col span={4} style={{textAlign: 'right' }}>
                <CancelButton
                  onClick={() => cancel(dataSource[i])}
                  loading={cancelId + '' === orderId + ''}
                >
                  Cancel
                </CancelButton>
              </Col>
            </Row>
          ))}
        </div>
        {/*<DataTable*/}
        {/*  emptyLabel="No open orders"*/}
        {/*  dataSource={dataSource}*/}
        {/*  columns={columns}*/}
        {/*  pagination={true}*/}
        {/*  pageSize={pageSize ? pageSize : 5}*/}
        {/*  loading={loading !== undefined && loading}*/}
        {/*/>*/}
      </Col>
    </Row>
  );
}
