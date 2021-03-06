import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Button,
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { styles } from "./style";
import Toast from "react-native-root-toast";
import { ViewPager } from 'rn-viewpager';
import PasswordInputPageItem from "./PasswordInputPageItem";
import { encryptObjectToString, setStorageAESKey, storage } from "../../utils/storage";
import { setIsSetLocalStorageAESKey } from "../../setup";
import I18n from "../../../I18n";

class PasswordInputPage extends Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        let title = I18n.t( "Password Set" );
        return {
            title: title,
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            oldPassword: '',
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps( nextProps ) {

    }

    setPassword( password ) {
        if ( password.length !== 6 ) {
            Toast.show( "Password length is not correctly" );

            return;
        }

        setStorageAESKey( password );

        storage.save( {
            key: 'PasswordInputPage',
            data: encryptObjectToString( {
                passwordCheck: "passwordCheck",
            } ),
        } ).then( () => {
            setIsSetLocalStorageAESKey( true );

            this.props.navigation.goBack();
            Toast.show( I18n.t( "Password Set Success" ) );


            const { navigate, goBack, state } = this.props.navigation;

            if ( state.params && state.params.callback ) {
                state.params && state.params.callback && state.params.callback();
            }
        } );
    }

    //
    // checkPassword() {
    //     if ( this.props.password.length <= 0 ) {
    //         Toast.show( "请先设置密码" );
    //
    //         return;
    //     }
    //
    //     this.setState( {
    //         isPasswordCheckOpen: true
    //     } );
    // }

    render() {
        return (
            <SafeAreaView style={styles.wrapper}>
                <View style={[ styles.wrapper, { backgroundColor: '#fafafa', } ]}>
                    <ViewPager
                        ref={( viewPager ) => {
                            this._viewPager = viewPager;
                        }}
                        style={[ styles.wrapper ]}
                        scrollEnabled={false}
                        initialPage={0}
                        keyboardDismissMode={'on-drag'}
                        onPageSelected={( p ) => {
                            if ( p.position === 1 ) {
                                this._passwordInputPageItem1.blur();
                                this._passwordInputPageItem2.focus();
                            }
                            else {
                                if ( p.position === 1 ) {
                                    this._passwordInputPageItem2.blur();
                                    this._passwordInputPageItem1.focus();
                                }
                            }
                        }}
                    >
                        <View>
                            <PasswordInputPageItem
                                ref={( passwordInputPageItem ) => {
                                    this._passwordInputPageItem1 = passwordInputPageItem;
                                }}
                                style={[ {} ]} title={I18n.t( "Password Input" )}
                                isSupportClear={true}
                                autoFocus={true}
                                onPasswordSet={( password ) => {
                                    // Toast.show( "First setup Password: " + password );

                                    this.setState( {
                                        oldPassword: password
                                    } );

                                    this._passwordInputPageItem1.blur();
                                    this._passwordInputPageItem2.clearPassword();
                                    this._viewPager.setPage( 1 )
                                }}
                            />
                        </View>
                        <View>
                            <PasswordInputPageItem
                                ref={( passwordInputPageItem ) => {
                                    this._passwordInputPageItem2 = passwordInputPageItem;
                                }}
                                style={[ {} ]} title={I18n.t( 'Password Check' )}
                                isSupportClear={false}
                                autoFocus={false}
                                onPasswordSet={( newPassword ) => {
                                    if ( newPassword === this.state.oldPassword ) {
                                        this._passwordInputPageItem1.blur();
                                        this._passwordInputPageItem2.blur();

                                        this.setPassword( newPassword );
                                    } else {
                                        Toast.show( I18n.t( 'Password Invalid' ), { position: Toast.positions.CENTER } );

                                        this._passwordInputPageItem1.clearPassword();
                                        this._passwordInputPageItem2.clearPassword();

                                        this._passwordInputPageItem2.blur();
                                        this._passwordInputPageItem1.focus();

                                        this.setState( {
                                            oldPassword: ''
                                        } );

                                        this._viewPager.setPage( 0 )
                                    }
                                }}
                            />
                        </View>
                    </ViewPager>
                </View>
            </SafeAreaView>
        );
    }
}

function mapDispatchToProps( dispatch ) {
    return {
        dispatch,
    };
}

function mapStateToProps( state ) {
    return {};
}

export default connect( mapStateToProps, mapDispatchToProps )( PasswordInputPage );
