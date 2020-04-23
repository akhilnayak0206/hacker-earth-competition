import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Skeleton,
  Popover,
  DatePicker,
  Modal
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import './App.css';

const { Search } = Input;

const App = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [visiblePopover, setVisiblePopover] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dateMoment, setDateMoment] = useState();

  const handleSearchChange = e => {
    if (e.target) {
      setSearch(e.target.value);
    }
  };

  const filteringSearch = () => {
    let filterCards = allRestaurants.filter(
      val =>
        new RegExp(search, 'i').exec(val.Brand) ||
        new RegExp(search, 'i').exec(val.Variety) ||
        new RegExp(search, 'i').exec(val.Style) ||
        new RegExp(search, 'i').exec(val.Country)
    );
    setFilteredRestaurants(filterCards);
    setDateFilter('');
    setDateMoment('');
  };

  const filterYear = () => {
    let filterCards = allRestaurants.filter(val => {
      let year = val['Top Ten'].split(' ');
      return new RegExp(dateFilter, 'i').exec(year[0]);
    });
    setFilteredRestaurants(filterCards);
    setSearch('');
  };

  //When component mounts: call once!!
  useEffect(() => {
    fetch('http://starlord.hackerearth.com/TopRamen')
      .then(res => res.json())
      .then(data => {
        setLoadingSkeleton(false);
        setAllRestaurants(data);
        setFilteredRestaurants(data);
      })
      .catch(err => console.log(err));
  }, []);

  //Keep listening to changes
  useEffect(() => {
    if (search) {
      filteringSearch();
    }
    if (dateFilter) {
      filterYear();
    } else {
      filteringSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, dateFilter]);

  return (
    <div className='App'>
      <Modal
        title={modalData.Brand}
        visible={visibleModal}
        onOk={() => setVisibleModal(false)}
        onCancel={() => setVisibleModal(false)}
      >
        <h3>Rank</h3>
        <Input value={modalData['Top Ten']} disabled />
        <h3>Brand</h3>
        <Input value={modalData.Brand} disabled />
        <h3>Variety</h3>
        <Input value={modalData.Variety} disabled />
        <h3>Country</h3>
        <Input value={modalData.Country} disabled />
        <h3>Stars</h3>
        <Input
          value={
            !isNaN(modalData.Stars) ? modalData.Stars : 'No Stars given yet.'
          }
          disabled
        />
      </Modal>
      <Skeleton loading={loadingSkeleton} active>
        <div
          style={{
            width: '100%',
            position: 'sticky',
            zIndex: 5,
            top: 5
          }}
        >
          <Card
            size='small'
            style={{ borderRadius: 5, width: '99%', margin: '5px' }}
            bodyStyle={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}
            hoverable
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}
            >
              <Search
                placeholder='Enter brand, variety, style or country'
                value={search}
                onSearch={value => handleSearchChange(value)}
                onChange={e => handleSearchChange(e)}
                enterButton
              />
              <Popover
                placement='leftTop'
                content={
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <DatePicker
                      onChange={(date, dateString) => {
                        setDateFilter(dateString);
                        setDateMoment(date);
                      }}
                      value={dateMoment}
                      picker='year'
                    />
                  </div>
                }
                title='Select Date'
                trigger='click'
                visible={visiblePopover}
                onVisibleChange={setVisiblePopover}
              >
                <Button type='primary'>
                  <FilterOutlined spin={visiblePopover} />
                </Button>
              </Popover>
            </div>
          </Card>
        </div>

        <div
          style={{
            height: '100%',
            margin: 20
          }}
        >
          {filteredRestaurants &&
            filteredRestaurants.map((val, key) => (
              <Card
                size='small'
                title={`Brand: ${val.Brand}`}
                style={{ borderRadius: 5, width: '100%', marginBottom: 10 }}
                key={key}
                onClick={() => {
                  setVisibleModal(true);
                  setModalData(val);
                }}
              >
                <p>
                  <b>Country: </b>
                  {val.Country}
                </p>
                <p>
                  <b>Variety: </b>
                  {val.Variety}
                </p>
              </Card>
            ))}
        </div>
      </Skeleton>
    </div>
  );
};

export default App;
