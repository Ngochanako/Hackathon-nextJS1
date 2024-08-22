import { NextResponse } from 'next/server';
import fs from 'fs';

import path from 'path';
type ParamType={
    params:{
        id:string
    }
}
type Product={
    id:string,
    productName:string,
    price:number,
    image:string,
    quantity:number
}
//API lấy thông tin chi tiết sản phẩm theo id
export async function GET(req:Request,{params}:ParamType){
    try {
        const pathName=path.join(process.cwd(),"database","products.json");
        const products:Product[]=JSON.parse(fs.readFileSync(pathName,'utf8'));
        const findIndex=products.findIndex(product=>product.id===params.id);
        if(findIndex>-1){
            const data=products[findIndex]
            return NextResponse.json(data)}
        else{
            return NextResponse.json({message:"Product not found"})
        }
    } catch (error) {
        return NextResponse.json(error);
    }   
}
//API cập nhập thông tin sản phẩm theo id
 export async function PUT(req:Request,{params}:ParamType){
    try {
        const pathName=path.join(process.cwd(),"database","products.json");
        const products:Product[]=JSON.parse(fs.readFileSync(pathName,'utf8'));
        const findIndex=products.findIndex(product=>product.id===params.id);
        const dataAPI=await req.json();
        if(findIndex>-1){
            products[findIndex]={...dataAPI,id:params.id}
            fs.writeFileSync(pathName,JSON.stringify(products),'utf8');
            return NextResponse.json({message:"cập nhập thành công",data:{...dataAPI,id:params.id}})
        }
        else{
            return NextResponse.json({message:"Product not found"})
        }
    } catch (error) {
        return NextResponse.json(error);
    }   
}
//xóa thông tin sản phẩm theo id
 export async function DELETE(req:Request,{params}:ParamType){
    try {
        const pathName=path.join(process.cwd(),"database","products.json");
        const products:Product[]=JSON.parse(fs.readFileSync(pathName,'utf8'));
        const findIndex=products.findIndex(product=>product.id===params.id);
        if(findIndex>-1){
            products.splice(findIndex,1);
            fs.writeFileSync(pathName,JSON.stringify(products),'utf8');
            return NextResponse.json({message:"xóa thành công",data:products});
        }
        else{
            return NextResponse.json({message:"Product not found"})
        }
    } catch (error) {
        return NextResponse.json(error);
    }   
}
