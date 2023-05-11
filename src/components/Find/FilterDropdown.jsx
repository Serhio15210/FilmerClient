import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MultiSelect} from "react-native-element-dropdown";
import {RadioButton, useTheme} from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import {MAIN_RED} from "../../constants";
import {data} from "../../constants/genres";


const FilterDropdown = ({
                          navigation,
                          filter,
                          setFilter,
                          setOpenTop,
                          setPage,
                          selectedDate,
                          setSelectedDate,
                          selectedYear,
                          setSelectedYear,
                          onPress,
                          setIsFilter,
  setQuery
                        }) => {


  const [checked, setChecked] = useState('not see');


  const {isDarkTheme} = useTheme()

  let years = []
  for (let i = new Date().getFullYear(); i >= 1881; i--) {
    years.push({
      "id": i,
      "name": i + ''
    });
  }

  const _renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={{color: 'black'}}>{item.name}</Text>

      </View>
    );
  };


  return (

    <View style={styles.container}>

      <View style={styles.radioButtonBlock}>
        <View style={styles.row}>
          <Text style={styles.radioButton}>Фильм</Text>
          <RadioButton value="name"
                       status={filter === 'movie' ? 'checked' : 'unchecked'}
                       onPress={() => {
                         if (filter !== 'movie'){
                           setFilter('movie')
                           setPage(1)
                           setIsFilter(false)
                           setQuery('')
                         }

                       }} color={"white"} uncheckedColor={"white"}/>
        </View>
        <View style={styles.row}>
          <Text style={styles.radioButton}>Сериал</Text>
          <RadioButton value="serial"
                       status={filter === 'serial' ? 'checked' : 'unchecked'}
                       onPress={() => {
                          if (filter !== 'serial'){
                            setFilter('serial')
                            setPage(1)
                            setIsFilter(false)
                            setQuery('')
                          }

                       }} color={'white'} uncheckedColor={'white'}/>
        </View>
        <View style={styles.row}>
          <Text style={styles.radioButton}>Актёр</Text>
          <RadioButton value="actor"
                       status={filter === 'actor' ? 'checked' : 'unchecked'}
                       onPress={() => {
                        if (filter !== 'actor'){
                          setFilter('actor')
                          setPage(1)
                          setIsFilter(false)
                          setQuery('')
                        }

                       }} color={'white'} uncheckedColor={'white'}/>
        </View>


      </View>

      {filter !== 'actor' &&
        <>
          <View style={{paddingBottom: normalize(20)}}>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={years}
              activeColor={isDarkTheme ? "#DAA520" : "#DC143C"}
              labelField="name"
              valueField="name"
              placeholder="Выберите год"
              value={selectedYear}
              search
              searchPlaceholder="Поиск..."
              onChange={item => {
                setSelectedYear(item);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="black"
                  name="calendar"
                  size={20}
                />
              )}
              renderItem={item => _renderItem(item)}
              renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.selectedText}>{item.name}</Text>
                    <AntDesign color="black" name="delete" size={17}/>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={{paddingBottom: 20}}>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              activeColor={isDarkTheme ? "#DAA520" : "#DC143C"}

              labelField="name"
              valueField="id"
              placeholder="Выбрать жанр"
              value={selectedDate}
              search
              searchPlaceholder="Поиск..."
              onChange={item => {
                setSelectedDate(item);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="black"
                  name="search1"
                  size={20}
                />
              )}
              renderItem={item => _renderItem(item)}
              renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.selectedText}>{item.name}</Text>
                    <AntDesign color="black" name="delete" size={17}/>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

      <TouchableOpacity style={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: normalize(50)
      }} onPress={onPress}>
        <Text style={{color: MAIN_RED, fontWeight: '600', fontSize: normalize(18)}}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: normalize(50),
        marginTop: normalize(15)
      }} onPress={() => {
        setSelectedDate([])
        setSelectedYear([])
        setIsFilter(false)
      }}>
        <Text style={{color: MAIN_RED, fontWeight: '600', fontSize: normalize(18)}}>Reset</Text>
      </TouchableOpacity>
        </>}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: normalize(15), width: '100%'
  },
  radioButtonBlock: {
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: normalize(15)
  },
  radioButton: {
    color: 'white'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  dropdown: {
    height: normalize(50),
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#DC143C',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: normalize(16),
    color: 'black'
  },
  selectedTextStyle: {
    fontSize: normalize(14),
    color: 'black'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: normalize(40),
    fontSize: normalize(16),
    color: 'black'
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: normalize(17),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#DC143C',
    marginTop: normalize(8),
    marginRight: normalize(12),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  selectedText: {
    color: 'black',
    marginRight: normalize(5)
  },
  filterTextSelectedStyle: {
    marginRight: normalize(5),
    fontSize: normalize(16),
    shadowColor: '#DC143C',
  },
});

export default FilterDropdown;
