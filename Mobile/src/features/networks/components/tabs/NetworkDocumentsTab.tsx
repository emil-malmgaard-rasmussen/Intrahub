import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {SCREEN_WIDTH} from '../../../../utils/Dimensions.ts';
import {useRefreshContext} from '../../../../navigation/RefreshContext.tsx';
import SearchBar from '../../../../components/SearchBar.tsx';
import PDFViewer from '../../../../components/PdfViewer.tsx';
import ImageViewer from '../../../../components/ImageViewer.tsx';
import {ThemeColors} from '../../../../theme/colors.ts';
import useThemeContext from '../../../../theme/useThemeContext.ts';

const NetworkDocumentsTab = ({networkId}) => {
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{
    title: string;
    type: string;
    url: string;
  } | null>(null);
  const {refresh} = useRefreshContext();
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const documentSlideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const searchDebounceRef = useRef(null);

  const getNetworkProjects = async (query = '') => {
    let projectQuery = firestore()
      .collection('PROJECTS')
      .where('networkId', '==', networkId);

    if (query) {
      projectQuery = projectQuery
        .where('name', '>=', query)
        .where('name', '<=', query + '\uf8ff');
    }

    projectQuery.onSnapshot(snapshot => {
      if (!snapshot) return;

      const fetchedProjects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFilteredProjects(fetchedProjects);
    });
  };

  useEffect(() => {
    getNetworkProjects();
  }, [networkId]);

  useEffect(() => {
    if (refresh) {
      getNetworkProjects(searchTerm);
    }
  }, [refresh]);

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      getNetworkProjects(searchTerm);
    }, 300);
  }, [searchTerm]);

  const openDocumentsPanel = project => {
    setSelectedProject(project);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDocumentsPanel = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedProject(null);
      setSelectedDocument(null);
    });
  };

  const openDocumentDetail = (document: any) => {
    setSelectedDocument(document);
    Animated.timing(documentSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDocumentDetail = () => {
    Animated.timing(documentSlideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedDocument(null));
  };

  const renderDocument = () => {
    switch (selectedDocument?.type) {
      case 'application/pdf':
        return <PDFViewer pdfUri={selectedDocument.url} />;
      case 'image/jpg':
        return <ImageViewer imageUri={selectedDocument?.url} />;
      case 'image/png':
        return <ImageViewer imageUri={selectedDocument?.url} />;
      case 'apv':
        return <RenderApvDocuments doc={selectedDocument} />;
      default:
        return <Text style={themeStyles.filePickerText}></Text>;
    }
  };

  return (
    <View style={themeStyles.container}>
      <SearchBar
        showBottomSheet={() => {}}
        data={searchTerm}
        setData={setSearchTerm}
      />
      <ScrollView
        style={{marginTop: 10}}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled">
        {filteredProjects.map(project => (
          <TouchableOpacity
            key={project.id}
            style={themeStyles.projectItem}
            onPress={() => openDocumentsPanel(project)}>
            <Text style={themeStyles.projectTitle}>{project.name}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/*<FlatList*/}
      {/*  nestedScrollEnabled={true}*/}
      {/*  data={filteredProjects}*/}
      {/*  keyExtractor={(item) => item.id}*/}
      {/*  renderItem={(project: any) => (*/}
      {/*    <TouchableOpacity*/}
      {/*      key={project.item.id}*/}
      {/*      style={themeStyles.projectItem}*/}
      {/*      onPress={() => openDocumentsPanel(project)}>*/}
      {/*      <Text style={themeStyles.projectTitle}>{project.item.name}</Text>*/}
      {/*      <Icon name="chevron-forward" size={24} color="#000" />*/}
      {/*    </TouchableOpacity>*/}
      {/*  )}*/}
      {/*  onTouchStart={() => setOuterScrollEnabled(false)}*/}
      {/*  onTouchEnd={() => setOuterScrollEnabled(true)}*/}
      {/*  onMomentumScrollBegin={() => setOuterScrollEnabled(false)}*/}
      {/*  onMomentumScrollEnd={() => setOuterScrollEnabled(true)}*/}
      {/*/>*/}

      {selectedProject && (
        <Animated.View
          style={[
            themeStyles.documentsPanel,
            {transform: [{translateX: slideAnim}]},
          ]}>
          <View style={themeStyles.panelHeader}>
            <TouchableOpacity onPress={closeDocumentsPanel}>
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={themeStyles.panelTitle}>{selectedProject.name}</Text>
          </View>
          <ScrollView style={{flex: 1}}>
            <ProjectDocumentsPane
              networkId={networkId}
              projectId={selectedProject.id}
              onDocumentPress={openDocumentDetail}
            />
          </ScrollView>
        </Animated.View>
      )}

      {selectedDocument && (
        <Animated.View
          style={[
            themeStyles.documentDetailPanel,
            {transform: [{translateX: documentSlideAnim}]},
          ]}>
          <View style={themeStyles.panelHeader}>
            <TouchableOpacity onPress={closeDocumentDetail}>
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={themeStyles.panelTitle}>{selectedDocument.title}</Text>
          </View>
          <View style={{flex: 1}}>{renderDocument()}</View>
        </Animated.View>
      )}
    </View>
  );
};

const ProjectDocumentsPane = ({
  networkId,
  projectId,
  onDocumentPress,
}: {
  networkId: string;
  projectId: string;
  onDocumentPress: (document: any) => void;
}) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('DOCUMENTS')
      .where('projectId', '==', projectId)
      .where('networkId', '==', networkId)
      .onSnapshot(snapshot => {
        if (!snapshot) {
          return;
        }
        const fetchedDocuments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(fetchedDocuments);
      });

    const unsubscribeTemp = firestore()
      .collection('APV')
      .where('project.id', '==', projectId)
      .where('networkId', '==', networkId)
      .onSnapshot(snapshot => {
        if (!snapshot) {
          return;
        }

        const fetchedDocuments = snapshot.docs.map(doc => ({
          id: doc.id,
          title: `APV - ${doc.data().startDate.toDate().toLocaleDateString()}`,
          type: 'apv',
          ...doc.data(),
        }));
        setDocuments(prev => [...prev, ...fetchedDocuments]);
      });

    return () => {
      unsubscribe();
      unsubscribeTemp();
    };
  }, [networkId, projectId]);

  return (
    <View style={{flex: 1}}>
      {documents.length === 0 ? (
        <Text style={themeStyles.emptyMessage}>Ingen dokumenter fundet</Text>
      ) : (
        documents.map(doc => (
          <TouchableOpacity
            key={doc.id}
            style={themeStyles.documentItem}
            onPress={() => onDocumentPress(doc)}>
            <Text style={themeStyles.documentTitle}>{doc.title}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const RenderApvDocuments = ({doc}: {doc: any}) => {
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);

  return (
    <View style={{flex: 1, padding: 5}}>
      <Text style={themeStyles.apvDocumentContent}>Titel: {doc.title}</Text>
      <Text style={themeStyles.apvDocumentContent}>
        Oprettet af: {doc.createdBy}
      </Text>
      {doc.startDate && (
        <Text style={themeStyles.apvDocumentContent}>
          Startdato: {doc.startDate.toDate().toLocaleDateString()}
        </Text>
      )}
      {doc.project && (
        <Text style={themeStyles.apvDocumentContent}>
          Projekt: {doc.project.name}
        </Text>
      )}
      <Text style={themeStyles.sectionTitle}>Risici:</Text>
      {doc?.risks?.length > 0 ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          horizontal
          style={{marginBottom: 20}}
          nestedScrollEnabled={true}>
          <View style={{borderWidth: 1, borderColor: '#ddd', borderRadius: 8}}>
            <View style={[themeStyles.tableRow, {backgroundColor: '#f4f4f4'}]}>
              <View style={themeStyles.tableHeader}>
                <Text style={themeStyles.text}>Navn</Text>
              </View>
              <View style={themeStyles.tableHeader}>
                <Text style={themeStyles.text}>Risiko</Text>
              </View>
              <View style={themeStyles.tableHeader}>
                <Text style={themeStyles.text}>Beskrivelse</Text>
              </View>
              <View style={themeStyles.tableHeader}>
                <Text style={themeStyles.text}>
                  Forebyggende foranstaltninger
                </Text>
              </View>
            </View>
            {doc.risks.map((risk: any, index: number) => (
              <View
                key={index}
                style={[
                  themeStyles.tableRow,
                  {
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                  },
                ]}>
                <View style={themeStyles.tableCell}>
                  <Text style={themeStyles.text}>{risk.name}</Text>
                </View>
                <View style={themeStyles.tableCell}>
                  <Text style={themeStyles.text}>{risk.assessment}</Text>
                </View>
                <View style={themeStyles.tableCell}>
                  <Text style={themeStyles.text}>{risk.description}</Text>
                </View>
                <View style={themeStyles.tableCell}>
                  <Text style={themeStyles.text}>
                    {risk.preventiveMeasures}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text style={{fontSize: 16, color: '#888'}}>
          No risks available for this APV.
        </Text>
      )}
      {doc.healthSafety && (
        <>
          <Text style={themeStyles.sectionTitle}>Sundhed og Sikkerhed:</Text>
          {doc.healthSafety.map((item: any, index: number) => (
            <Text key={index} style={themeStyles.apvDocumentContent}>
              - {item.description}
            </Text>
          ))}
        </>
      )}
      {doc.evaluation && (
        <>
          <Text style={themeStyles.sectionTitle}>Evaluering:</Text>
          {doc.evaluation.map((item: any, index: number) => (
            <Text key={index} style={themeStyles.apvDocumentContent}>
              - {item.description}
            </Text>
          ))}
        </>
      )}
      {doc.conclusion && (
        <>
          <Text style={themeStyles.sectionTitle}>Konklusion:</Text>
          <Text style={themeStyles.apvDocumentContent}>{doc.conclusion}</Text>
        </>
      )}
    </View>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
    projectItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      backgroundColor: '#f9f9f9',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      marginBottom: 10,
    },
    projectTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text.default,
    },
    documentsPanel: {
      padding: 20,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#fff',
      zIndex: 10,
    },
    documentDetailPanel: {
      position: 'absolute',
      width: SCREEN_WIDTH,
      height: '120%',
      backgroundColor: '#fff',
      right: 0,
      top: 0,
      padding: 20,
      zIndex: 20,
    },
    panelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    panelTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 10,
      color: colors.text.default,
    },
    documentItem: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    documentTitle: {
      fontSize: 16,
      color: colors.text.default,
    },
    documentContent: {
      fontSize: 16,
      marginTop: 10,
    },
    pdf: {
      flex: 1,
      width: Dimensions.get('window').width / 3,
      height: Dimensions.get('window').height / 3,
      marginVertical: 10,
    },
    filePickerText: {
      color: '#888',
    },
    emptyMessage: {
      color: '#959595',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 15,
      marginBottom: 5,
      color: '#000',
    },
    apvDocumentContent: {
      fontSize: 16,
      lineHeight: 22,
      color: '#333',
      marginBottom: 10,
    },
    list: {
      padding: 16,
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ccc',
    },
    header: {
      backgroundColor: '#f4f4f4',
      borderBottomWidth: 2,
    },
    cell: {
      flex: 1,
      padding: 8,
      textAlign: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
    },
    tableHeader: {
      width: 130, // Fixed width for consistent alignment
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRightWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#f4f4f4',
    },
    tableCell: {
      width: 130,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRightWidth: 1,
      borderColor: '#ddd',
    },
    text: {
      textAlign: 'center',
    },
  });

export default NetworkDocumentsTab;
