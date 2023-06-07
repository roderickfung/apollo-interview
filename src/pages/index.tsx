import React from 'react'
import {
  MaxWidthContainer,
} from 'axelra-react-utilities';
import {ReactElement} from 'react';
import styled from 'styled-components';
import MainLayout from '../layouts/main.layout';
import ToDoController, { useToDoContext } from '../controller/ListController';

const Container = styled(MaxWidthContainer)`
  margin-top: 50px;
  overflow: hidden;
  height: 100%;
  width: 85%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > * {
    width: 100%;
  }

`;

const Input = styled.input`
  margin: 10px;

  & > label.checked {
    text-decoration: line-through
  }
`

const ItemContainer = styled.div`
  width: 100%;
  min-height: 20px;
  display: grid;
  grid-template-columns: 30px 1fr 50px;

  & > * {
    word-wrap: wrap;
  }
`

const Button = styled.button`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CheckBox = styled.input`
  border-radius: 50%;
`


const Item = ({ id, item }: any) => {
  const [isHover, setHover] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [value, setValue] = React.useState(item.value);
  const { editItem, removeItem } = useToDoContext();

  const resetValue = () => setValue('');

  const onDeletePress = () => removeItem(id)
  const onEditPress = () => {
    setEdit(id)
  }

  const onEnterDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value !== '') {
        editItem({
          id,
          value: value,
          checked: item.checked
        });
        resetValue();
        setEdit(!isEdit);
      }
    }
  }

  const onSetValue = (e: any) => setValue(e.currentTarget.value);

  const onSelect = (e: any) => editItem({
    id,
    value: item.value,
    checked: !item.checked
  })

  return (
    <ItemContainer onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <CheckBox type="checkbox" value={item.checked} onChange={onSelect}/>
      {
        !!isEdit ? <input type='text' value={value} onChange={onSetValue} onKeyDown={onEnterDown}/> : <label className={item.checked ? 'checked' : ''} onDoubleClick={onEditPress}>{item.value}</label>
      }
      { isHover ? 
        <Button onClick={onDeletePress}>x</Button> : null
      }
    </ItemContainer>
  )

}


const Home = () => {

  const [value, setValue] = React.useState('');
  const { data, addItem } = useToDoContext();


  const onSetValue = (e: any) => setValue(e.currentTarget.value);
  const resetValue = () => setValue('');

  const onEnterDown = (e: any) => {
    if (e.key === 'Enter') {
      console.log("ENTER PRESSED", e, value);
      e.preventDefault();
      if (value !== '') {
        addItem(value);
        resetValue();
      }
    }
  }

  React.useEffect(() => {
    console.log('DATA', data);
  }, [data])
  
  const entries = data.data
  const keys = Object.keys(entries).reverse();

  return (
    <Container>
      <Input type="text" value={value} onChange={onSetValue} onKeyDown={onEnterDown} />
      <div>
        {
          
          keys.map((key) => {
          const entry = entries[key];

          return (
            <Item key={key} id={key} item={entry} />
          )

        })
      }
      </div>
    </Container>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <ToDoController>
      <MainLayout>{page}</MainLayout>
    </ToDoController>
  )
};

export default Home;
