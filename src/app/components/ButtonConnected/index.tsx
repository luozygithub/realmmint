import * as React from 'react';
import styled from 'styled-components/macro';
import {useEffect} from "react";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {useAppGlobalStateSlice} from "../../slice";

interface Props {
    primaryAddress?: string;
    disabled?: boolean;
    onClick?: any;
    classes?: string;
    block?: boolean;
}

export function ButtonConnected({ primaryAddress, disabled, block, onClick, classes }: Props) {
    // @ts-ignore
    const [account,setAccount ] = useState("")

    const dispatch = useDispatch();
    const globalSlice = useAppGlobalStateSlice()
    let getAccount = async () => {

        // @ts-ignore
        const accounts = await window.unisat.getAccounts()
        console.log(accounts)
        setAccount(accounts[0])
        dispatch(globalSlice.actions.setAccountAddr(accounts[0]));
        // @ts-ignore
        window.unisat.on("accountsChanged",async ()=>{
            // @ts-ignore
            const accounts = await window.unisat.getAccounts()
            console.log(accounts)
            setAccount(accounts[0])
            dispatch(globalSlice.actions.setAccountAddr(accounts[0]));
        })
    }
    useEffect( ()=>{
        getAccount()
        // @ts-ignore
    },[window.unisat])
    return (
        <Div>
            {account && (
                <Button
                    className={
                        `btn ${classes ? classes : ''}` +
                        (+!!block ? ' w-100 ' : '') +
                        (disabled ? ' disabled ' : ' ')
                    }
                    onClick={onClick}
                >
                    <i className="fa fa-check" /> {account?.substring(0, 10) + '...'}
                </Button>
            )}
            {!primaryAddress && (
                <Button
                    className={
                        `btn ${classes ? classes : ''}` +
                        (+!!block ? ' w-100 ' : '') +
                        (disabled ? ' disabled ' : ' ')
                    }
                    onClick={onClick}
                >
                    <i className="fa fa-wallet"></i> Connect Wallet
                </Button>
            )}
        </Div>
    );
}

const Div = styled.div`
    width: 100%;
`;

const Button = styled.a`
    border: none;
    border-radius: 4px;
    text-align: center;
    font-weight: normal;
    display: block;
    color: #eee;
    width: 100%;
    &:hover {
        color: #fff;
        text-decoration: none;
        cursor: pointer;
    }

    background-color: rgb(89, 36, 143);
    background-image: rgb(89, 36, 143);
    color: #fff;

    &:hover {
        color: #fff;
        text-decoration: none;
        cursor: pointer;
        background-color: rgb(89, 36, 143, 0.9);
        background-image: rgba(89, 36, 143, 0.9);
    }

    &.disabled {
        opacity: 0.5;
        color: #fff;
        &:hover {
            cursor: not-allowed;
            background-image: linear-gradient(270deg, hsl(210, 85%, 45%) 0%, #0abcf9 95%);
        }
    }
`;
