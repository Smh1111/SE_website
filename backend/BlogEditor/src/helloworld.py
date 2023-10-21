from fastapi import FastAPI

testApp = FastAPI()

@testApp.get("/")
async def root():
    return "hello world"