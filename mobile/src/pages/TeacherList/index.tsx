import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorege from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';


import TeacherItem, { Teacher } from '../../components/TeacherItem';
import PageHeader from '../../components/PageHeader';

import styles from './styles';

import api from '../../services/api';

function TeacherList() {
  const [isfiltersVisible, setIsfiltersVisible] = useState(false);

  const [favorites, setFavorites] = useState<number[]>([]);
  const [teachers, setTeachers] = useState([]);

  const [ subject, setSubject ] = useState('');
  const [ week_day, setWeek_day ] = useState('');
  const [ time, setTime ] = useState('');

  function loadFavorites(){
    AsyncStorege.getItem('favorites').then(res => {
      if(res){
        const favoritedTeachers = JSON.parse(res);
        const favoritedTeachersIds = favoritedTeachers.map( (teacher: Teacher) => { return teacher.id; })
        
        setFavorites(favoritedTeachersIds);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  })

  async function handleFiltersSubmit(){
    loadFavorites();
    
    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time,
      }
    })

    setIsfiltersVisible(false);
    setTeachers(response.data);

  }

  function handleToggleFiltersVisible() {
    setIsfiltersVisible(!isfiltersVisible);
  }

  return (
    <View style={styles.container}>
      <PageHeader 
        title="Proffys disponíveis" 
        headerRigth={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#FFF"/>
          </BorderlessButton>
        )}
      >
        {isfiltersVisible && (
          <View style={styles.searchform}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={text => setSubject(text)}
              placeholder={"Qual a matéria?"}
              placeholderTextColor="#C1BCCC"
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  style={styles.input}
                  value={week_day}
                  onChangeText={text => setWeek_day(text)}
                  placeholder={"Qual o dia"}
                  placeholderTextColor="#C1BCCC"
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={text => setTime(text)}
                  placeholder={"Qual horário"}
                  placeholderTextColor="#C1BCCC"
                />
              </View>
            </View>

            <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>)
        }

      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return <TeacherItem 
                    key={teacher.id} 
                    teacher={teacher}
                    favorited={favorites.includes(teacher.id)}
                  />
        })}
      </ScrollView>
    </View>
  )
}

export default TeacherList;