import React from 'react';
import {FlatList, TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ListPreview from "./ListPreview";
import {useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {normalize} from "../../responsive/fontSize";
import {useTheme} from "../../providers/ThemeProvider";

const ListsRow = () => {
  const {
    user, refresh, userList
  } = useSelector((state) => state.auth);
  const navigation = useNavigation()

  return (
    <>
      <FlatList horizontal={true} data={userList} keyExtractor={(item, index) => `key-${index}`}
                contentContainerStyle={{alignItems: 'center'}}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => {
                  return (
                    <ListPreview data={item} onPress={() => navigation.navigate('ListOverview', {
                      id: item?._id,
                      title: item?.name
                    })}/>

                  );
                }}
                ListFooterComponent={<TouchableOpacity onPress={() => navigation.navigate('AddList')}
                                                       style={{marginLeft: normalize(50)}}>
                  <Ionicons name={'add-circle-outline'} size={100} color={'black'}/>
                </TouchableOpacity>}
                ListHeaderComponent={<ListPreview data={user?.favoriteFilms} isFavorite={true}
                                                  onPress={() => navigation.navigate('FavoriteListOverview')}/>}
      />
    </>
  );
};

export default React.memo(ListsRow);
