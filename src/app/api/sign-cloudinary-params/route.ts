import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

function getCloudinaryApiSecret() {
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!apiSecret) {
    throw new Error('Missing CLOUDINARY_API_SECRET')
  }

  return apiSecret
}

const handler = async (request: Request) => {
  const body = await request.json()

  const { paramsToSign } = body || {}
  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      getCloudinaryApiSecret()
    )

    return NextResponse.json({ signature })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export { handler as POST }
