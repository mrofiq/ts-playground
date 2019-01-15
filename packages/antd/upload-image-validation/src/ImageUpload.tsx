import { Icon, message, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import React, { Component } from 'react';

function getBase64(img?: File, callback?: any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img!);
}

type ImageResolution = { width: number; height: number };

function getImageResolution(file: File): Promise<ImageResolution> {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      // console.log(img.naturalHeight, img.naturalWidth);
      resolve({ height: img.naturalHeight, width: img.naturalWidth });
    };
    img.onerror = e => {
      reject(e);
    };
    img.src = window.URL.createObjectURL(file);
  });
}

const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;

function beforeUpload(file: File): boolean | Promise<boolean> {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }

  if (isJPG && isLt2M) {
    // now check for image resolution
    return new Promise((resolve, reject) => {
      getImageResolution(file)
        .then(res => {
          if (res.width <= MAX_WIDTH && res.height <= MAX_HEIGHT) {
            resolve(true);
          } else {
            message.error(`Image resolution invalid max. ${MAX_WIDTH}x${MAX_HEIGHT}`);
            reject(false);
          }
        })
        .catch(e => {
          message.error(e.message);
          reject(false);
        });
    });
  }

  return false;
}

class Avatar extends Component<{}, { loading: boolean; imageUrl?: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleChange = (info: UploadChangeParam) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: string) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="//jsonplaceholder.typicode.com/posts/"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
    );
  }
}

export { Avatar };
