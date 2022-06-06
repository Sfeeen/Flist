import { StyleSheet } from 'react-native';
import { greaterThan } from 'react-native-reanimated';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    tinyLogo: {
        height: 100,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        height: 40,
        //backgroundColor: "blue"
    },
    pick: {
        flex: 0.6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
        marginHorizontal:5,

    },
    label: {
        flex: 1,
        fontSize: 15
    },
    input: {
        flex: 1,
        height: 30,
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    comment: {
        marginVertical: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
        padding: 10,
        height: 100,
        textAlignVertical: 'top',
        fontSize: 20,
    },
    footer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',

    },
    footcontent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    bold: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    flex: {
        flex: 1,
    },
    historyBox: {
        backgroundColor: '#e0f0d3',
        margin: 20,
        marginVertical: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
        padding: 10,
    },
    historyBoxError: {
        backgroundColor: "#c98baf",
        margin: 20,
        marginVertical: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
        padding: 10,
    },
    historyRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    italic: {
        fontStyle: "italic",
        marginVertical: 5
    },
    cam: {
        backgroundColor: "#85c79a",
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: "black",
        borderWidth: 1,
        padding: 10,
        margin: 10,
    },
    nobold: {
        fontWeight: 'normal',
        //flexDirection: 'row',
        //justifyContent: 'space-between'
    },
    marg: {
        marginHorizontal: 10,
    },
    inline: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 50,
        //backgroundColor: "green"
    },
    middle: {
        flexDirection: 'row',
        alignItems: 'center'
    },

});