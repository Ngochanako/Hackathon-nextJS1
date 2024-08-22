import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
type Product={
    id:string,
    productName:string,
    price:number,
    image:string,
    quantity:number
}
//API GET request
export async function GET(request:Request){
    try {
        const pathName=path.join(process.cwd(),"database","products.json");
        const products:Product[]=JSON.parse(fs.readFileSync(pathName,'utf8'));
        const url=new URL(request.url);
        const productName=url.searchParams.get('name');
        //lấy danh sách tất cả sản phẩm
        if(!productName){
            return NextResponse.json(products);
        }
        //lấy danh sách tìm kiếm sản phẩm theo tên
        const listProductsByName=products.filter(product=>product.productName.toLowerCase().includes(productName.toLowerCase()));
        if(listProductsByName.length>0){
            return NextResponse.json(listProductsByName);
        }
        return NextResponse.json({message:"No products"});
    } catch (error) {
        return NextResponse.json(error);
    }
    
}
//API thêm mới sản phẩm
export async function POST(req: Request, res: Response){
    try {
        const pathName=path.join(process.cwd(),"database","products.json");
        const products=JSON.parse(fs.readFileSync(pathName,"utf8"));
        const dataAPI=await req.json();
        const newProduct:Product={...dataAPI,id:Math.floor(Math.random()*10000000000).toString()};
        products.push(newProduct);
        fs.writeFileSync(pathName,JSON.stringify(products),'utf8');
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json(error);
    }
}
