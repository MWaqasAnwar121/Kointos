import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article.model';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  console.log(params)

  try {
    // Use .lean() to get a plain JavaScript object
    const article = await Article.findById(id).lean();

    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    // Return the plain object
    return NextResponse.json(article);

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const { title, content, userId } = await request.json();
  try {
    // Use .lean() to get a plain JavaScript object
    const article = await Article.findOneAndUpdate({
      userId: userId,
      _id: id
    }, {
      $set: {
        title,
        content,
      }
    }, { new: true });



    if (!article) {
      return NextResponse.json({ message: 'Article not found or you are not the author' }, { status: 404 });
    }

    // Return the plain object
    return NextResponse.json(article);

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}